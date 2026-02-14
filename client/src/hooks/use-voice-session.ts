"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { GoogleGenAI, Modality } from "@google/genai";
import { useAuth } from "@clerk/nextjs";

type VoiceState = "idle" | "connecting" | "listening" | "speaking" | "error";

interface UseVoiceSessionReturn {
  state: VoiceState;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  analyserNode: AnalyserNode | null;
  inputAnalyserNode: AnalyserNode | null;
}

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

export function useVoiceSession(): UseVoiceSessionReturn {
  const { getToken } = useAuth();
  const [state, setState] = useState<VoiceState>("idle");
  const [error, setError] = useState<string | null>(null);

  // Refs to persist across renders
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioQueueRef = useRef<ArrayBuffer[]>([]);
  const isPlayingRef = useRef(false);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const inputAnalyserRef = useRef<AnalyserNode | null>(null);

  // Cleanup function
  const cleanup = useCallback(() => {
    // Stop mic
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    // Disconnect audio nodes
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    if (inputAnalyserRef.current) {
      inputAnalyserRef.current.disconnect();
      inputAnalyserRef.current = null;
    }

    // Close audio context
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }

    // Close Gemini session
    if (sessionRef.current) {
      try {
        sessionRef.current.close();
      } catch {
        // ignore
      }
      sessionRef.current = null;
    }

    audioQueueRef.current = [];
    isPlayingRef.current = false;
  }, []);

  // Play queued audio chunks
  const playNextChunk = useCallback(async () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0) return;
    if (!audioCtxRef.current) return;

    isPlayingRef.current = true;
    setState("speaking");

    while (audioQueueRef.current.length > 0) {
      const chunk = audioQueueRef.current.shift();
      if (!chunk || !audioCtxRef.current) break;

      // Convert PCM 16-bit to Float32 for Web Audio API
      const int16 = new Int16Array(chunk);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768;
      }

      const buffer = audioCtxRef.current.createBuffer(1, float32.length, 24000);
      buffer.getChannelData(0).set(float32);

      const source = audioCtxRef.current.createBufferSource();
      source.buffer = buffer;

      // Connect to analyser if available, then to destination
      if (analyserRef.current) {
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioCtxRef.current.destination);
      } else {
        source.connect(audioCtxRef.current.destination);
      }

      await new Promise<void>((resolve) => {
        source.onended = () => resolve();
        source.start();
      });
    }

    isPlayingRef.current = false;
    if (sessionRef.current) {
      setState("listening");
    }
  }, []);

  const connect = useCallback(async () => {
    try {
      setState("connecting");
      setError(null);

      // 1. Get ephemeral token from our backend
      const authToken = await getToken();
      const tokenRes = await fetch(`${serverUrl}/api/assistant/voice-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!tokenRes.ok) {
        throw new Error("Failed to get voice token");
      }

      const tokenData = await tokenRes.json();
      const ephemeralToken = tokenData.data.token;

      // 2. Initialize Audio Context & Analyser
      audioCtxRef.current = new AudioContext({ sampleRate: 24000 });
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.5;

      // 3. Connect to Gemini Live API with v1alpha (required for ephemeral tokens)
      const ai = new GoogleGenAI({
        apiKey: ephemeralToken,
        httpOptions: { apiVersion: "v1alpha" },
      });
      const session = await ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-12-2025",
        config: {
          responseModalities: [Modality.AUDIO],
        },
        callbacks: {
          onopen: () => {
            console.log("[Voice] Connected to Gemini Live API");
          },
          onmessage: (message: any) => {
            // Handle interruptions
            if (message.serverContent?.interrupted) {
              audioQueueRef.current = [];
              isPlayingRef.current = false;
              setState("listening");
              return;
            }

            // Handle audio responses
            if (message.serverContent?.modelTurn?.parts) {
              for (const part of message.serverContent.modelTurn.parts) {
                if (part.inlineData?.data) {
                  const binaryStr = atob(part.inlineData.data);
                  const bytes = new Uint8Array(binaryStr.length);
                  for (let i = 0; i < binaryStr.length; i++) {
                    bytes[i] = binaryStr.charCodeAt(i);
                  }
                  audioQueueRef.current.push(bytes.buffer);
                  playNextChunk();
                }
              }
            }
          },
          onerror: (e: any) => {
            console.error("[Voice] Error:", e);
            setError(e?.message || String(e) || "Connection error");
            setState("error");
          },
          onclose: () => {
            console.log("[Voice] Connection closed");
            if (state !== "idle") {
              cleanup();
              setState("idle");
            }
          },
        },
      });

      sessionRef.current = session;

      // 4. Setup microphone — use default sample rate (browser native)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = stream;

      // Use default AudioContext (matches browser's native sample rate)
      const micCtx = new AudioContext();
      const nativeSampleRate = micCtx.sampleRate;
      const source = micCtx.createMediaStreamSource(stream);
      const processor = micCtx.createScriptProcessor(4096, 1, 1);

      // Also connect mic to the MAIN analyser (need to be careful with contexts)
      // Since micCtx and audioCtxRef are different, we can't connect nodes directly.
      // Ideally we should use one context, but resampling is needed.
      // We can use the processed data volume for "listening" visualization if needed,
      // or create a separate analyser for the mic context.
      // For simplicity: We will use a separate analyser for mic visualization inside the component
      // OR we can export the `micCtx` or `stream`.
      // Actually, let's keep it simple: The `analyserNode` exposed will be for the SPEAKER (Assistant).
      // For the MIC (User), we can create another analyser here or let the component handle it via Stream?
      // Better: Create `micAnalyser` in micCtx. But we need to expose it.

      // Let's modify: `analyserNode` -> `outputAnalyser` and add `inputAnalyser`.
      // But creating `inputAnalyser` in `micCtx` is easy.
      // For compatibility, let's try to pass the stream to the component to visualize input?
      // Or just handle input visualization here.

      // Let's rely on `analyserRef` which is attached to `audioCtxRef` (Speaker).
      // For Mic, we can attach an analyser to `micCtx`.

      // NOTE: `VoiceMode` component will likely want ONE visualizer.
      // When "listening", visualize Mic. When "speaking", visualize Output.
      // I will expose `volume` which I calculate inside the loops.

      // Processor loop (Input) -> calculate volume
      processor.onaudioprocess = (e) => {
        if (!sessionRef.current) return;

        const inputData = e.inputBuffer.getChannelData(0);

        // Calculate Mic Volume for visualization hook?
        // We can't easily perform high-freq updates to react state.

        // Downsample logic...
        const targetRate = 16000;
        const ratio = nativeSampleRate / targetRate;
        const targetLength = Math.floor(inputData.length / ratio);
        const int16 = new Int16Array(targetLength);

        for (let i = 0; i < targetLength; i++) {
          const srcIndex = Math.floor(i * ratio);
          const s = Math.max(-1, Math.min(1, inputData[srcIndex]));
          int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        const bytes = new Uint8Array(int16.buffer);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);

        session.sendRealtimeInput({
          audio: {
            data: base64,
            mimeType: "audio/pcm;rate=16000",
          },
        });
      };

      const inputAnalyser = micCtx.createAnalyser();
      inputAnalyser.fftSize = 64;
      inputAnalyser.smoothingTimeConstant = 0.5;
      inputAnalyserRef.current = inputAnalyser;

      source.connect(inputAnalyser);
      inputAnalyser.connect(processor);
      processor.connect(micCtx.destination);
      sourceRef.current = source;
      processorRef.current = processor;

      setState("listening");
    } catch (err: any) {
      console.error("[Voice] Connection failed:", err);
      setError(err.message || "Failed to connect");
      setState("error");
      cleanup();
    }
  }, [getToken, cleanup, playNextChunk, state]);

  const disconnect = useCallback(() => {
    cleanup();
    setState("idle");
    setError(null);
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
    state,
    error,
    connect,
    disconnect,
    analyserNode: analyserRef.current,
    inputAnalyserNode: inputAnalyserRef.current,
  };
}

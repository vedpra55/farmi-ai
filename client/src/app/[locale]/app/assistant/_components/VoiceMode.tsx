"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, MicOff, Loader2 } from "lucide-react";
import { useVoiceSession } from "@/hooks/use-voice-session";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface VoiceModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceMode({ isOpen, onClose }: VoiceModeProps) {
  const t = useTranslations("Assistant.voiceState");
  const { state, error, connect, disconnect, analyserNode, inputAnalyserNode } =
    useVoiceSession();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  // Auto-connect when opened
  useEffect(() => {
    if (isOpen && state === "idle") {
      connect();
    }
  }, [isOpen, state, connect]);

  const handleClose = () => {
    disconnect();
    onClose();
  };

  // Visualizer Loop
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      if (!canvas) return;

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Determine active analyser and base color
      let activeAnalyser = null;
      let baseColor = { r: 100, g: 100, b: 100 }; // Gray
      let baseRadius = 60;
      let pulseSpeed = 0.002;

      if (state === "listening") {
        activeAnalyser = inputAnalyserNode;
        baseColor = { r: 34, g: 197, b: 94 }; // Primary Green (#22c55e)
        baseRadius = 70;
        pulseSpeed = 0.005;
      } else if (state === "speaking") {
        activeAnalyser = analyserNode;
        baseColor = { r: 59, g: 130, b: 246 }; // Blue
        baseRadius = 80;
        pulseSpeed = 0.008;
      } else if (state === "connecting") {
        baseColor = { r: 234, g: 179, b: 8 }; // Yellow
        baseRadius = 50;
        pulseSpeed = 0.02;
      } else if (state === "error") {
        baseColor = { r: 239, g: 68, b: 68 }; // Red
      }

      // Get frequency data if available
      let volume = 0;
      if (activeAnalyser) {
        const dataArray = new Uint8Array(activeAnalyser.frequencyBinCount);
        activeAnalyser.getByteFrequencyData(dataArray);

        // Calculate average volume
        let sum = 0;
        // Focus on lower frequencies for "bass" feel
        const limit = Math.floor(dataArray.length / 2);
        for (let i = 0; i < limit; i++) {
          sum += dataArray[i];
        }
        volume = sum / limit; // 0-255
      }

      // Animation time
      const time = Date.now();

      // Dynamic Radius
      // Base pulse + volume reaction
      const pulse = Math.sin(time * pulseSpeed) * 5;
      const volumeFactor = Math.pow(volume / 255, 1.5) * 60; // enhance reaction
      const currentRadius = baseRadius + pulse + volumeFactor;

      // Draw Orb
      // 1. Outer Glow
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        currentRadius * 0.5,
        centerX,
        centerY,
        currentRadius * 2,
      );
      gradient.addColorStop(
        0,
        `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.8)`,
      );
      gradient.addColorStop(
        0.5,
        `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.2)`,
      );
      gradient.addColorStop(
        1,
        `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0)`,
      );

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, currentRadius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // 2. Core
      ctx.fillStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 1)`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, currentRadius * 0.8, 0, Math.PI * 2);
      ctx.fill();

      // 3. Inner Rings (Ripple effect)
      if (state === "listening" || state === "speaking") {
        ctx.strokeStyle = `rgba(255, 255, 255, 0.3)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, currentRadius * 0.6, 0, Math.PI * 2);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isOpen, state, analyserNode, inputAnalyserNode]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/95 backdrop-blur-xl"
            onClick={handleClose}
          />

          {/* Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative z-10 flex flex-col items-center justify-center w-full h-full"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-3 rounded-full bg-surface/50 border border-border text-foreground-muted hover:text-foreground transition-colors backdrop-blur-md"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Canvas for Visualizer */}
            <div className="relative w-[300px] h-[300px] flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={300}
                height={300}
                className="relative z-10"
              />
              {/* Fallback Icon if canvas fails or during load */}
              {state === "error" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <MicOff className="w-12 h-12 text-danger" />
                </div>
              )}
            </div>

            {/* Status Text */}
            <div className="mt-8 text-center space-y-2">
              <h2 className="text-2xl font-semibold text-foreground tracking-tight">
                {state === "idle" && t("idle")}
                {state === "connecting" && t("connecting")}
                {state === "listening" && t("listening")}
                {state === "speaking" && t("speaking")}
                {state === "error" && t("errorTitle")}
              </h2>

              <p className="text-foreground-muted font-medium max-w-xs mx-auto">
                {state === "listening" && t("listeningHelp")}
                {state === "error" && (error || t("errorHelp"))}
              </p>

              {state === "error" && (
                <button
                  onClick={connect}
                  className="mt-4 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary-hover transition-all"
                >
                  {t("retry")}
                </button>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-12 flex items-center gap-6">
              <button
                onClick={handleClose}
                className="p-4 rounded-full bg-surface border border-border text-danger hover:bg-danger/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

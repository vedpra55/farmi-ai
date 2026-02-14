"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onClear: () => void;
  selectedImage: File | null;
  disabled?: boolean;
}

export const ImageUpload = ({
  onImageSelect,
  onClear,
  selectedImage,
  disabled = false,
}: ImageUploadProps) => {
  const t = useTranslations("Disease.upload");
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onImageSelect(file);
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
      }
    },
    [onImageSelect],
  );

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onClear();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center w-full min-h-[300px] border-2 border-dashed rounded-xl transition-colors cursor-pointer overflow-hidden bg-background/50",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-muted/50",
        disabled && "opacity-50 cursor-not-allowed",
        preview && "border-none p-0",
      )}
    >
      <input {...getInputProps()} />

      {preview ? (
        <div className="relative w-full h-full min-h-[300px] group">
          <Image
            src={preview}
            alt={t("selectedAlt")}
            fill
            className="object-contain"
          />
          {!disabled && (
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="p-4 bg-muted rounded-full">
            {isDragActive ? (
              <Upload className="w-8 h-8 text-primary animate-bounce" />
            ) : (
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium">
              {isDragActive ? t("drop") : t("title")}
            </p>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t("subtitle")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

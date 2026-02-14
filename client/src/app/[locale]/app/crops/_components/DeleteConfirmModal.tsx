"use client";

import { Modal } from "@/components/ui/Modal";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  cropName: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  cropName,
}: DeleteConfirmModalProps) {
  const t = useTranslations("Crops.delete");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // error handled in store
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("title")}
      maxWidth="max-w-sm"
    >
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground">
          {t.rich("message", {
            crop: () => (
              <span className="font-semibold text-foreground">{cropName}</span>
            ),
          })}
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? t("deleting") : t("confirm")}
          </button>
        </div>
      </div>
    </Modal>
  );
}

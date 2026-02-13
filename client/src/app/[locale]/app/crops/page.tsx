"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useUserStore } from "@/store/user-store";
import { Plus, Sprout } from "lucide-react";
import { ICropDetail } from "@/types/user";
import { CropCard } from "./_components/CropCard";
import { CropFormModal } from "./_components/CropFormModal";
import { DeleteConfirmModal } from "./_components/DeleteConfirmModal";

export default function CropsPage() {
  const { getToken } = useAuth();
  const user = useUserStore((s) => s.user);
  const { addCrop, updateCrop, deleteCrop } = useUserStore();
  const crops = user?.crops ?? [];

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState<ICropDetail | null>(null);
  const [deletingCrop, setDeletingCrop] = useState<ICropDetail | null>(null);

  const handleAdd = () => {
    setEditingCrop(null);
    setShowForm(true);
  };

  const handleEdit = (crop: ICropDetail) => {
    setEditingCrop(crop);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: Omit<ICropDetail, "_id">) => {
    const token = await getToken();
    if (editingCrop?._id) {
      await updateCrop(editingCrop._id, data, token);
    } else {
      await addCrop(data, token);
    }
  };

  const handleDelete = async () => {
    if (deletingCrop?._id) {
      const token = await getToken();
      await deleteCrop(deletingCrop._id, token);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 max-w-5xl mx-auto w-full pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            My Crops
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {crops.length > 0
              ? `${crops.length} crop${crops.length > 1 ? "s" : ""} registered`
              : "No crops added yet"}
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Crop
        </button>
      </div>

      {/* Crop Grid */}
      {crops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {crops.map((crop, index) => (
            <CropCard
              key={crop._id || index}
              crop={crop}
              onEdit={handleEdit}
              onDelete={setDeletingCrop}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-4 bg-secondary/50 rounded-full mb-4">
            <Sprout className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            No crops yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-4">
            Add your first crop to start getting personalized farming insights.
          </p>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add First Crop
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <CropFormModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingCrop(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingCrop}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={!!deletingCrop}
        onClose={() => setDeletingCrop(null)}
        onConfirm={handleDelete}
        cropName={deletingCrop?.cropName || ""}
      />
    </div>
  );
}

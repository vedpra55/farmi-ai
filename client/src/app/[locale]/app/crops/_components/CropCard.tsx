import { Sprout, Pencil, Trash2 } from "lucide-react";
import { ICropDetail } from "@/types/user";

interface CropCardProps {
  crop: ICropDetail;
  onEdit: (crop: ICropDetail) => void;
  onDelete: (crop: ICropDetail) => void;
}

export function CropCard({ crop, onEdit, onDelete }: CropCardProps) {
  const sowingDate = crop.sowingDate ? new Date(crop.sowingDate) : new Date();
  const daysSinceSowing = Math.floor(
    (new Date().getTime() - sowingDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  const stageMap: Record<string, number> = {
    germination: 10,
    vegetative: 30,
    flowering: 55,
    fruiting: 75,
    harvesting: 95,
  };
  const progress = stageMap[crop.growthStage?.toLowerCase()] ?? 15;

  return (
    <div className="bg-background border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-primary/20 transition-colors">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Sprout className="w-20 h-20 text-primary" />
      </div>

      {/* Actions — top right */}
      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={() => onEdit(crop)}
          className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          title="Edit"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(crop)}
          className="p-1.5 rounded-md hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="bg-success/10 text-success text-xs font-semibold px-2.5 py-1 rounded-md">
            Active
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            Day {daysSinceSowing}
          </span>
        </div>

        <h3 className="text-xl font-bold text-foreground mb-1">
          {crop.cropName}
        </h3>
        <p className="text-sm text-muted-foreground">
          {crop.sowingDate
            ? `Sown on ${new Date(crop.sowingDate).toLocaleDateString()}`
            : "Sowing date not set"}
        </p>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-medium text-muted-foreground capitalize">
            {crop.growthStage || "Vegetative"}
          </span>
        </div>

        {crop.pastDiseaseHistory && (
          <p className="text-xs text-warning font-medium mt-2">
            ⚠️ Past disease history reported
          </p>
        )}

        {crop.averageYieldLastSeason !== undefined &&
          crop.averageYieldLastSeason > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Last yield: {crop.averageYieldLastSeason} quintals
            </p>
          )}
      </div>
    </div>
  );
}

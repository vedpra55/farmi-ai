import { useUserStore } from "@/store/user-store";
import { Link } from "@/i18n/navigation";
import { Sprout, ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export function CropOverview() {
  const t = useTranslations("DashboardHome.cropOverview");
  const locale = useLocale();
  const user = useUserStore((s) => s.user);

  const currentCrop = user?.crops?.[0];
  const cropName = currentCrop?.cropName || t("defaultCrop");
  const totalCrops = user?.crops?.length ?? 0;
  const sowingDate = currentCrop?.sowingDate
    ? new Date(currentCrop.sowingDate)
    : new Date();

  const daysSinceSowing = Math.floor(
    (new Date().getTime() - sowingDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const stageKey = currentCrop?.growthStage?.toLowerCase();
  const knownStages = [
    "germination",
    "vegetative",
    "flowering",
    "fruiting",
    "harvesting",
  ];
  const stageLabelKey =
    stageKey && knownStages.includes(stageKey) ? stageKey : "unknown";
  const stageLabel = t(`stage.${stageLabelKey}` as any);
  const extraCount = totalCrops - 1;

  return (
    <Link
      href="/app/crops"
      className="bg-background border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-primary/20 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Sprout className="w-24 h-24 text-primary" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="bg-success/10 text-success text-xs font-semibold px-2.5 py-1 rounded-md">
            {t("monitoringActive")}
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            {t("dayLabel", { day: daysSinceSowing })}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-1">{cropName}</h2>
        <p className="text-sm text-muted-foreground">
          {currentCrop?.sowingDate
            ? t("sownOn", {
                date: dateFormatter.format(new Date(currentCrop.sowingDate)),
              })
            : t("sowingDateNotSet")}
        </p>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-success w-[15%] rounded-full" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {stageLabel}
          </span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">
            {totalCrops > 1
              ? extraCount === 1
                ? t("moreCrop", { count: extraCount })
                : t("moreCrops", { count: extraCount })
              : t("viewCropDetails")}
          </span>
          <span className="text-xs font-medium text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {t("viewAll")} <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

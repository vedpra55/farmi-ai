import { useUserStore } from "@/store/user-store";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

export function WelcomeHeader() {
  const t = useTranslations("DashboardHome.header");
  const locale = useLocale();
  const user = useUserStore((s) => s.user);

  const userName = user?.name?.split(" ")[0] || t("defaultName");
  const userCity =
    user?.location?.villageOrTown ||
    user?.location?.district ||
    t("defaultLocation");
  const currentCrop = user?.crops?.[0];
  const cropName = currentCrop?.cropName || t("defaultCrop");

  // Dynamic greeting based on time
  const hour = new Date().getHours();
  let greeting = t("evening");
  if (hour < 12) greeting = t("morning");
  else if (hour < 18) greeting = t("afternoon");

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="flex flex-row justify-between items-center gap-6 py-4 md:py-0">
      <div className="space-y-2">
        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5 bg-secondary/60 px-2.5 py-1 rounded-md text-foreground/80 font-medium">
            📍 {userCity}
          </span>
          <span className="text-muted-foreground/40">•</span>
          <span>{dateFormatter.format(new Date())}</span>
        </div>

        <h1 className="text-3xl capitalize md:text-4xl font-serif font-medium text-foreground tracking-tight leading-tight">
          {greeting}, {userName} 👋
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed">
          {t("statusLine", { crop: cropName })}
        </p>
      </div>

      {/* Mascot — desktop only */}
      <div className="hidden md:block relative w-36 h-36 shrink-0">
        <Image
          src="/assets/farmer-2.png"
          alt={t("mascotAlt")}
          fill
          className="object-contain drop-shadow-sm"
          priority
        />
      </div>
    </header>
  );
}

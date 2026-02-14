import { Link } from "@/i18n/navigation";
import { Upload, CloudSun, MessageSquare, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

const actions = [
  {
    href: "/app/disease",
    icon: Upload,
    key: "scan",
    color: "primary",
  },
  {
    href: "/app/weather",
    icon: CloudSun,
    key: "weather",
    color: "info",
  },
  {
    href: "/app/assistant",
    icon: MessageSquare,
    key: "assistant",
    color: "accent",
  },
] as const;

// Map color token to Tailwind classes
const colorMap = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    hoverBorder: "hover:border-primary/50",
    blob: "bg-primary/5",
    blobHover: "group-hover:bg-primary/10",
  },
  info: {
    bg: "bg-info/10",
    text: "text-info",
    hoverBorder: "hover:border-info/50",
    blob: "bg-info/5",
    blobHover: "group-hover:bg-info/10",
  },
  accent: {
    bg: "bg-accent/10",
    text: "text-accent",
    hoverBorder: "hover:border-accent/50",
    blob: "bg-accent/5",
    blobHover: "group-hover:bg-accent/10",
  },
};

export function QuickActions() {
  const t = useTranslations("DashboardHome.quickActions");

  return (
    <section>
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {t("title")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {actions.map((action) => {
          const colors = colorMap[action.color];
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              href={action.href}
              className={`group relative overflow-hidden bg-background border border-border ${colors.hoverBorder} hover:shadow-md rounded-xl p-6 transition-all duration-300 flex flex-col items-start gap-4 cursor-pointer`}
            >
              <div
                className={`absolute top-0 right-0 w-24 h-24 ${colors.blob} rounded-bl-full -mr-4 -mt-4 ${colors.blobHover} transition-colors`}
              />
              <div
                className={`p-3 ${colors.bg} ${colors.text} rounded-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-lg">
                  {t(`${action.key}.title`)}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {t(`${action.key}.description`)}
                </p>
              </div>
              <div
                className={`mt-auto pt-2 flex items-center ${colors.text} text-sm font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all`}
              >
                {t(`${action.key}.cta`)} <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

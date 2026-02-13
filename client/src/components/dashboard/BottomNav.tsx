"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  LayoutDashboard,
  CloudSun,
  ScanLine,
  MessageSquare,
  Sprout,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "home", href: "/app" },
  { icon: Sprout, label: "crops", href: "/app/crops" },
  { icon: ScanLine, label: "disease", href: "/app/disease" },
  { icon: CloudSun, label: "weather", href: "/app/weather" },
  { icon: MessageSquare, label: "assistant", href: "/app/assistant" },
];

export function BottomNav() {
  const t = useTranslations("Dashboard.sidebar");
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-elevated border-t border-border z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-around items-center px-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full gap-1",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon
              className={cn(
                "w-6 h-6 transition-all duration-200",
                isActive ? "-translate-y-1 drop-shadow-sm" : "",
              )}
            />
            <span
              className={cn(
                "text-[10px] font-medium transition-opacity",
                isActive ? "opacity-100" : "opacity-70",
              )}
            >
              {t(item.label as any)}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

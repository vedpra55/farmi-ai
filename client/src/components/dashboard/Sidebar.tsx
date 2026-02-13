"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  LayoutDashboard,
  CloudSun,
  ScanLine,
  Bell,
  MessageSquare,
  Settings,
  User,
  Sprout,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { icon: LayoutDashboard, label: "home", href: "/app" },
  { icon: Sprout, label: "crops", href: "/app/crops" },
  { icon: ScanLine, label: "disease", href: "/app/disease" },
  { icon: CloudSun, label: "weather", href: "/app/weather" },
  { icon: Bell, label: "alerts", href: "/app/alerts" },
  { icon: MessageSquare, label: "assistant", href: "/app/assistant" },
  { icon: Settings, label: "settings", href: "/app/settings" },
];

export function Sidebar() {
  const t = useTranslations("Dashboard.sidebar");
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-background border-r border-border z-50">
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 relative">
          <Image
            src="/icon.svg"
            alt="FarmAI Logo"
            fill
            className="object-contain"
          />
        </div>
        <span className="font-bold text-xl tracking-tight text-foreground">
          FarmAI
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-surface border border-border text-foreground font-semibold"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              />
              {t(item.label as any)}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-foreground">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              Raj Farmer
            </p>
            <p className="text-xs text-muted-foreground truncate">
              raj@example.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

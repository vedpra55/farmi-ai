"use client";

import { useClerk } from "@clerk/nextjs";
import { LogOut, Globe, Moon, User } from "lucide-react";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import { useTranslations } from "next-intl";

export default function SettingsPage() {
  const t = useTranslations("Settings");
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(() => router.push("/"));
  };

  return (
    <div className="space-y-8 pb-8 animate-in p-8 fade-in duration-500 max-w-2xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-normal tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
      </div>

      <div className="grid gap-8">
        {/* Language Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-medium">{t("language.title")}</h2>
          </div>
          <div className="flex items-center justify-between ">
            <div className="space-y-0.5">
              <label className="text-base font-normal">
                {t("language.label")}
              </label>
              <p className="text-sm text-muted-foreground">
                {t("language.description")}
              </p>
            </div>
            <LanguageSwitcher />
          </div>
        </section>

        {/* Appearance Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Moon className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-medium">{t("appearance.title")}</h2>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-base font-normal">
                {t("appearance.label")}
              </label>
              <p className="text-sm text-muted-foreground">
                {t("appearance.description")}
              </p>
            </div>
            <ThemeToggle />
          </div>
        </section>

        {/* Account Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <User className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-medium">{t("account.title")}</h2>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-base font-normal text-destructive">
                {t("account.signOutLabel")}
              </label>
              <p className="text-sm text-muted-foreground">
                {t("account.signOutDescription")}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              {t("account.signOutCta")}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

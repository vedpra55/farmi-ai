import { useTranslations } from "next-intl";

export default function AppPage() {
  const t = useTranslations("AppPage");
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{t("welcome")}</h1>
        <p className="mt-2 text-muted-foreground">{t("comingSoon")}</p>
      </div>
    </main>
  );
}

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");
  return (
    <main className="min-h-screen bg-background p-8 md:p-16">
      <nav className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("brand")}</h1>
        <div>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-green-700">
                {t("signIn")}
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>
    </main>
  );
}

"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition, ChangeEvent } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="relative">
      <select
        defaultValue={locale}
        onChange={handleChange}
        disabled={isPending}
        className="appearance-none bg-background border border-input hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
        aria-label="Select language"
      >
        <option value="en">English</option>
        <option value="hi">हिंदी (Hindi)</option>
      </select>
    </div>
  );
}

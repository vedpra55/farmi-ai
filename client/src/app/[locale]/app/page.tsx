"use client";

import { WelcomeHeader } from "./_components/WelcomeHeader";
import { CropOverview } from "./_components/CropOverview";
import { WeatherSnapshot } from "./_components/WeatherSnapshot";
import { QuickActions } from "./_components/QuickActions";
import { SetupProgress } from "./_components/SetupProgress";

export default function AppPage() {
  return (
    <div className="flex flex-col gap-10 p-4 md:p-8 max-w-5xl mx-auto w-full pb-24 md:pb-8">
      <WelcomeHeader />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CropOverview />
        <WeatherSnapshot />
      </section>

      <QuickActions />
      <SetupProgress />
    </div>
  );
}

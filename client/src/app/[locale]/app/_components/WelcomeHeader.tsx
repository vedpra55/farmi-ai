import { useUserStore } from "@/store/user-store";
import Image from "next/image";

export function WelcomeHeader() {
  const user = useUserStore((s) => s.user);

  const userName = user?.name?.split(" ")[0] || "Farmer";
  const userCity =
    user?.location?.villageOrTown || user?.location?.district || "India";
  const currentCrop = user?.crops?.[0];
  const cropName = currentCrop?.cropName || "Crop";

  // Dynamic greeting based on time
  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  return (
    <header className="flex flex-row justify-between items-center gap-6 py-4 md:py-0">
      <div className="space-y-2">
        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5 bg-secondary/60 px-2.5 py-1 rounded-md text-foreground/80 font-medium">
            📍 {userCity}
          </span>
          <span className="text-muted-foreground/40">•</span>
          <span>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground tracking-tight leading-tight">
          {greeting}, {userName} 👋
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed">
          Your <span className="font-medium text-foreground">{cropName}</span>{" "}
          is looking good today.
        </p>
      </div>

      {/* Mascot — desktop only */}
      <div className="hidden md:block relative w-36 h-36 shrink-0">
        <Image
          src="/assets/farmer-2.png"
          alt="Farmer Mascot"
          fill
          className="object-contain drop-shadow-sm"
          priority
        />
      </div>
    </header>
  );
}

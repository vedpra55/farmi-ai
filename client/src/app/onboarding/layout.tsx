import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims } = await auth();

  // If already onboarded, redirect to /app
  if (sessionClaims?.metadata?.onboardingComplete === true) {
    redirect("/app");
  }

  return <>{children}</>;
}

"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Leaf,
  CloudRain,
  MessageSquare,
  Globe,
  ArrowRight,
  Sparkles,
  Sprout,
  Camera,
  ShieldCheck,
  Bell,
  Mic,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslations } from "next-intl";

// Generated Asset
const HERO_BG = "/assets/bg.png";

export default function Home() {
  const t = useTranslations("HomePage");

  const features = [
    {
      title: t("features.list.dashboard.title"),
      desc: t("features.list.dashboard.desc"),
      icon: <BarChart3 className="h-5 w-5 text-emerald-700" />,
    },
    {
      title: t("features.list.disease.title"),
      desc: t("features.list.disease.desc"),
      icon: <Camera className="h-5 w-5 text-emerald-700" />,
    },
    {
      title: t("features.list.weather.title"),
      desc: t("features.list.weather.desc"),
      icon: <CloudRain className="h-5 w-5 text-emerald-700" />,
    },
    {
      title: t("features.list.language.title"),
      desc: t("features.list.language.desc"),
      icon: <Globe className="h-5 w-5 text-emerald-700" />,
    },
    {
      title: t("features.list.voice.title"),
      desc: t("features.list.voice.desc"),
      icon: <Mic className="h-5 w-5 text-emerald-700" />,
    },
    {
      title: t("features.list.assistant.title"),
      desc: t("features.list.assistant.desc"),
      icon: <MessageSquare className="h-5 w-5 text-emerald-700" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-900/15">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                {t("brand")}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                {t("footer.links.features")}
              </Link>
              <div className="h-5 w-px bg-emerald-900/10" />

              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    variant="ghost"
                    className="font-semibold text-slate-700 hover:text-slate-900 hover:bg-emerald-50"
                  >
                    {t("signIn")}
                  </Button>
                </SignInButton>
                <SignInButton mode="modal">
                  <Button className="bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10 rounded-full px-6 transition-all hover:scale-105">
                    {t("getStarted")}
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/app">
                  <Button className="bg-emerald-700 text-white hover:bg-emerald-800 shadow-lg shadow-emerald-900/20 rounded-full px-6 transition-all hover:scale-105">
                    {t("dashboard")}
                  </Button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
            <div className="md:hidden flex items-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button size="sm">{t("signIn")}</Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* HERO SECTION */}
        <section className="relative pt-40 pb-28 md:pt-52 md:pb-36 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 opacity-25">
              <Image
                src={HERO_BG}
                alt="Farm background texture"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary-light))_0%,hsl(var(--background))_55%,hsl(var(--background))_100%)]" />
            <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
            <svg
              aria-hidden="true"
              className="absolute left-10 top-28 h-28 w-28 text-emerald-200/70"
              viewBox="0 0 120 120"
              fill="none"
            >
              <path
                d="M20 70C50 20 95 18 100 46C103 64 87 88 56 94C40 98 22 90 20 70Z"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                d="M35 76C52 64 70 52 92 40"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>
            <svg
              aria-hidden="true"
              className="absolute right-8 bottom-16 h-32 w-32 text-emerald-300/60"
              viewBox="0 0 120 120"
              fill="none"
            >
              <circle
                cx="60"
                cy="60"
                r="44"
                stroke="currentColor"
                strokeWidth="3"
              />
              <circle
                cx="60"
                cy="60"
                r="18"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-widest mb-8">
                <Sparkles className="h-4 w-4" />
                {t("hero.badge")}
              </div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.05]">
                <span className="font-serif italic">
                  {t("hero.titlePart1")}
                </span>
                <br />
                {t("hero.titlePart2")}
              </h1>

              <p className="text-lg md:text-2xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                {t("hero.subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button
                      size="lg"
                      className="h-14 px-8 rounded-full text-base font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xl shadow-emerald-900/20 hover:-translate-y-1 transition-all"
                    >
                      {t("hero.cta")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/app">
                    <Button
                      size="lg"
                      className="h-14 px-8 rounded-full text-base font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xl shadow-emerald-900/20 hover:-translate-y-1 transition-all"
                    >
                      {t("hero.dashboardCta")}{" "}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </SignedIn>
              </div>
            </motion.div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: t("hero.highlights.monitoring.title"),
                  desc: t("hero.highlights.monitoring.desc"),
                  icon: <ShieldCheck className="h-5 w-5 text-emerald-700" />,
                },
                {
                  title: t("hero.highlights.intelligence.title"),
                  desc: t("hero.highlights.intelligence.desc"),
                  icon: <CloudRain className="h-5 w-5 text-emerald-700" />,
                },
                {
                  title: t("hero.highlights.accessible.title"),
                  desc: t("hero.highlights.accessible.desc"),
                  icon: <Mic className="h-5 w-5 text-emerald-700" />,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-3xl border border-border bg-surface-overlay px-6 py-6 text-left shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div className="text-sm font-semibold text-emerald-800">
                      {item.title}
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="challenge" className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
                  {t("challenge.title")}
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                  {t("challenge.description")}
                </p>
                <div className="rounded-3xl border border-border bg-emerald-50/60 p-6">
                  <div className="text-xs font-semibold uppercase tracking-widest text-emerald-800 mb-4">
                    {t("challenge.label")}
                  </div>
                  <ul className="space-y-3 text-slate-700 font-medium">
                    <li className="flex items-center gap-3">
                      <ShieldCheck className="h-4 w-4 text-emerald-700" />
                      {t("challenge.items.insights")}
                    </li>
                    <li className="flex items-center gap-3">
                      <Camera className="h-4 w-4 text-emerald-700" />
                      {t("challenge.items.detection")}
                    </li>
                    <li className="flex items-center gap-3">
                      <Bell className="h-4 w-4 text-emerald-700" />
                      {t("challenge.items.monitoring")}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="relative">
                <div className="rounded-[2.5rem] bg-slate-900 p-10 text-white shadow-2xl shadow-emerald-900/20">
                  <div className="text-xs font-semibold uppercase tracking-widest text-emerald-200 mb-6">
                    {t("challenge.bridge.label")}
                  </div>
                  <div className="space-y-6">
                    {[
                      t("challenge.bridge.items.support"),
                      t("challenge.bridge.items.workflow"),
                      t("challenge.bridge.items.yield"),
                    ].map((text) => (
                      <div key={text} className="flex items-start gap-4">
                        <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                        <p className="text-lg font-medium text-slate-100">
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 rounded-3xl bg-emerald-600 px-5 py-4 text-white shadow-lg">
                  <div className="text-xs uppercase tracking-widest text-emerald-100">
                    {t("challenge.badge.top")}
                  </div>
                  <div className="text-xl font-bold">
                    {t("challenge.badge.bottom")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 mb-14">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-3">
                  {t("howItWorks.label")}
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                  {t("howItWorks.title")}
                </h2>
              </div>
              <p className="text-lg text-slate-600 max-w-2xl">
                {t("howItWorks.description")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: t("howItWorks.steps.step1.title"),
                  desc: t("howItWorks.steps.step1.desc"),
                  icon: <Sprout className="h-6 w-6 text-emerald-700" />,
                },
                {
                  title: t("howItWorks.steps.step2.title"),
                  desc: t("howItWorks.steps.step2.desc"),
                  icon: <Camera className="h-6 w-6 text-emerald-700" />,
                },
                {
                  title: t("howItWorks.steps.step3.title"),
                  desc: t("howItWorks.steps.step3.desc"),
                  icon: <MessageSquare className="h-6 w-6 text-emerald-700" />,
                },
              ].map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-3xl bg-surface-overlay border border-border p-8 shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                      {step.icon}
                    </div>
                    <div className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
                      Step {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-14">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
                {t("features.title")}
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl">
                {t("features.description")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="rounded-3xl border border-border bg-background p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="rounded-[3rem] border border-border bg-surface-overlay p-10 md:p-14 shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-4">
                    {t("realWorld.label")}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
                    {t("realWorld.title")}
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {t("realWorld.description")}
                  </p>
                </div>
                <div className="space-y-5">
                  {[
                    t("realWorld.points.local"),
                    t("realWorld.points.alerts"),
                    t("realWorld.points.voice"),
                  ].map((point) => (
                    <div
                      key={point}
                      className="flex items-start gap-4 rounded-2xl border border-border bg-emerald-50/70 p-5"
                    >
                      <div className="h-10 w-10 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                        <Leaf className="h-5 w-5" />
                      </div>
                      <p className="text-slate-700 font-medium">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto bg-emerald-700 rounded-[3rem] overflow-hidden relative shadow-2xl shadow-emerald-900/30">
            <div className="absolute inset-0 opacity-20">
              <Image
                src={HERO_BG}
                alt="Farm texture"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10 py-20 px-8 md:px-20 text-center text-white">
              <div className="text-sm font-semibold uppercase tracking-widest text-emerald-100 mb-4">
                {t("finalCta.label")}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {t("finalCta.title")}
              </h2>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    size="lg"
                    className="h-16 px-10 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform border-none"
                  >
                    {t("finalCta.button")}
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/app">
                  <Button
                    size="lg"
                    className="h-16 px-10 rounded-full bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-lg shadow-xl hover:scale-105 transition-transform border-none"
                  >
                    {t("finalCta.button")}
                  </Button>
                </Link>
              </SignedIn>
            </div>
          </div>
        </section>

        <footer className="py-16 bg-surface border-t border-border">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  {t("brand")}
                </span>
              </div>
              <p className="text-slate-600 mt-4">{t("footer.tagline")}</p>
              <p className="text-xs text-slate-400 mt-6">
                {t("footer.rights")}
              </p>
            </div>

            <div>
              <div className="text-sm font-semibold text-slate-900 mb-3">
                {t("footer.sections.quickLinks")}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                <Link href="#" className="hover:text-slate-900">
                  {t("footer.links.home")}
                </Link>
                <Link href="#features" className="hover:text-slate-900">
                  {t("footer.links.features")}
                </Link>
                <Link href="#" className="hover:text-slate-900">
                  {t("footer.links.about")}
                </Link>
                <Link href="#" className="hover:text-slate-900">
                  {t("footer.links.contact")}
                </Link>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-slate-900 mb-3">
                {t("footer.sections.controls")}
              </div>
              <div className="flex items-center gap-4">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

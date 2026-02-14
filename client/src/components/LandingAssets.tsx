"use client";

export function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <svg
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-full opacity-30"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              stopColor="hsl(var(--primary))"
              stopOpacity="0.2"
            />
            <stop
              offset="100%"
              stopColor="hsl(var(--accent))"
              stopOpacity="0.1"
            />
          </linearGradient>
        </defs>
        <path
          d="M936,654.5Q803,809,612.5,854Q422,899,286.5,745.5Q151,592,207.5,410.5Q264,229,451,180.5Q638,132,790,266Q942,400,936,654.5Z"
          fill="url(#grad1)"
        />
      </svg>
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl mix-blend-multiply animate-blob" />
      <div className="absolute top-40 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
      <div className="absolute -bottom-20 left-1/4 w-96 h-96 bg-success/10 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000" />
    </div>
  );
}

export function SectionDivider() {
  return (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
      <svg
        className="relative block w-[calc(100%+1.3px)] h-[60px]"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          fill="hsl(var(--surface))"
          className="fill-surface"
        ></path>
      </svg>
    </div>
  );
}

export function GridPattern() {
  return (
    <svg
      className="absolute inset-0 -z-10 h-full w-full stroke-primary/10 mask-[radial-gradient(100%_100%_at_top_right,white,transparent)]"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="grid-pattern"
          width={40}
          height={40}
          x="50%"
          y={-1}
          patternUnits="userSpaceOnUse"
        >
          <path d="M.5 40V.5H40" fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill="url(#grid-pattern)"
      />
    </svg>
  );
}

export function LeafPattern() {
  return (
    <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none bg-[url('/leaf-pattern.svg')] bg-repeat" />
    // Placeholder for a recurring leaf pattern if we had the asset,
    // for now we can simulate with CSS or just leave it as a subtle texture
  );
}

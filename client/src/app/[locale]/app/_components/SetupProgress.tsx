import { CheckCircle2, Circle } from "lucide-react";

export function SetupProgress() {
  return (
    <section className="bg-background border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground">Setup Progress</h3>
        <span className="text-xs font-mono bg-secondary px-2 py-1 rounded text-foreground">
          1/3 Completed
        </span>
      </div>

      <div className="space-y-4">
        {/* Completed Step */}
        <div className="flex items-center gap-4">
          <div className="shrink-0 text-success">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground line-through decoration-muted-foreground/30 opacity-50">
              Complete Farm Profile
            </p>
          </div>
        </div>

        {/* Current Step */}
        <div className="flex items-center gap-4 cursor-pointer">
          <div className="shrink-0 text-primary">
            <Circle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">Scan your first crop</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Required to generate health score
            </p>
          </div>
          <div className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
            Start
          </div>
        </div>

        {/* Future Step */}
        <div className="flex items-center gap-4 opacity-50">
          <div className="shrink-0 text-muted-foreground">
            <Circle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">Enable Smart Alerts</p>
          </div>
        </div>
      </div>
    </section>
  );
}

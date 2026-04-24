import { motion } from "framer-motion";
import type { PredictionResult } from "@/lib/blood-prediction";

interface Props {
  loading: boolean;
  result: PredictionResult | null;
  imageDataUrl: string | null;
  onDownload?: () => void;
  onSave?: () => void;
  canSave?: boolean;
}

export function ResultPanel({ loading, result, imageDataUrl, onDownload, onSave, canSave }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">AI Prediction</h3>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${result ? "bg-success/15 text-success" : "bg-secondary text-muted-foreground"}`}>
          {loading ? "Analyzing…" : result ? "Complete" : "Idle"}
        </span>
      </div>

      {!result && !loading && (
        <EmptyState />
      )}

      {loading && <LoadingState />}

      {result && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div className="flex items-center gap-5 rounded-2xl border border-border bg-surface p-5">
            <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl gradient-primary shadow-elegant">
              <span className="font-display text-3xl font-extrabold text-primary-foreground">{result.bloodGroup}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Predicted blood group</p>
              <p className="font-display text-2xl font-extrabold">{result.bloodGroup}</p>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Confidence</span>
                  <span className="font-semibold text-foreground">{(result.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full gradient-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {imageDataUrl && (
            <div className="relative overflow-hidden rounded-xl border border-border">
              <img src={imageDataUrl} alt="Analyzed" className="h-56 w-full object-cover" />
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {result.regions.map((r, i) => (
                  <motion.circle
                    key={i}
                    cx={r.x}
                    cy={r.y}
                    r={r.r}
                    fill="none"
                    stroke="oklch(0.55 0.21 22)"
                    strokeWidth={0.6}
                    strokeDasharray="2 1.5"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.15 }}
                  />
                ))}
              </svg>
              <div className="absolute bottom-2 left-2 rounded-md bg-background/85 px-2 py-1 text-[10px] font-semibold backdrop-blur">
                Detected agglutination regions
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <Reagent label="Anti-A" value={result.agglutination.antiA} />
            <Reagent label="Anti-B" value={result.agglutination.antiB} />
            <Reagent label="Anti-D" value={result.agglutination.antiD} />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={onSave}
              disabled={!canSave}
              className="flex-1 rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Save to history
            </button>
            <button
              onClick={onDownload}
              className="flex-1 rounded-xl gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:opacity-95"
            >
              Download PDF report
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Reagent({ label, value }: { label: string; value: number }) {
  const positive = value > 0.5;
  return (
    <div className="rounded-xl border border-border bg-surface p-3 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-1 font-display text-lg font-extrabold ${positive ? "text-primary" : "text-muted-foreground"}`}>
        {positive ? "Positive" : "Negative"}
      </p>
      <p className="text-[10px] text-muted-foreground">{(value * 100).toFixed(0)}% reaction</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path d="M12 2.5c1.8 2.6 6.5 8.4 6.5 12.5a6.5 6.5 0 1 1-13 0C5.5 10.9 10.2 5.1 12 2.5z" />
        </svg>
      </div>
      <div>
        <p className="font-semibold">No analysis yet</p>
        <p className="text-xs text-muted-foreground">Upload a sample and run the AI to see results.</p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex h-72 flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-surface">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
        <div className="absolute inset-2 rounded-full gradient-primary" />
      </div>
      <div className="text-center">
        <p className="font-semibold">Running AI inference</p>
        <p className="text-xs text-muted-foreground">Preprocessing · Detecting regions · Classifying</p>
      </div>
    </div>
  );
}

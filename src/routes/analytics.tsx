import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { loadRecords, type PatientRecord } from "@/lib/blood-prediction";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — HemoAI" },
      { name: "description", content: "Distribution of predicted blood groups and confidence stats." },
    ],
  }),
  component: AnalyticsPage,
});

const GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

function AnalyticsPage() {
  const [records, setRecords] = useState<PatientRecord[]>([]);
  useEffect(() => setRecords(loadRecords()), []);

  const stats = useMemo(() => {
    const counts: Record<string, number> = Object.fromEntries(GROUPS.map((g) => [g, 0]));
    let confSum = 0;
    records.forEach((r) => {
      counts[r.result.bloodGroup] = (counts[r.result.bloodGroup] || 0) + 1;
      confSum += r.result.confidence;
    });
    const max = Math.max(1, ...Object.values(counts));
    return {
      counts,
      max,
      total: records.length,
      avgConfidence: records.length ? confSum / records.length : 0,
      rhPositive: records.filter((r) => r.result.bloodGroup.endsWith("+")).length,
    };
  }, [records]);

  return (
    <main className="mx-auto max-w-6xl px-6 pb-20 pt-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-extrabold">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Insights from your saved predictions.</p>
      </header>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Kpi label="Total analyses" value={String(stats.total)} />
        <Kpi label="Avg. confidence" value={`${(stats.avgConfidence * 100).toFixed(1)}%`} />
        <Kpi label="Rh positive" value={String(stats.rhPositive)} />
        <Kpi label="Rh negative" value={String(stats.total - stats.rhPositive)} />
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="mb-6 font-display text-lg font-bold">Blood group distribution</h2>
        {stats.total === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">No data yet — run analyses to see distribution.</p>
        ) : (
          <div className="grid grid-cols-4 gap-4 sm:grid-cols-8">
            {GROUPS.map((g) => {
              const c = stats.counts[g] || 0;
              const h = Math.max(8, (c / stats.max) * 180);
              return (
                <div key={g} className="flex flex-col items-center gap-2">
                  <div className="flex h-[200px] w-full items-end">
                    <div
                      className="w-full rounded-t-lg gradient-primary transition-all"
                      style={{ height: `${h}px`, opacity: c === 0 ? 0.15 : 1 }}
                    />
                  </div>
                  <span className="font-display text-sm font-bold">{g}</span>
                  <span className="text-xs text-muted-foreground">{c}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-extrabold">{value}</p>
    </div>
  );
}

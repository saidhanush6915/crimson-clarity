import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { deleteRecord, loadRecords, type PatientRecord } from "@/lib/blood-prediction";
import { generatePdfReport } from "@/lib/pdf-report";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — HemoAI" },
      { name: "description", content: "Previous blood group predictions and patient records." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [records, setRecords] = useState<PatientRecord[]>([]);

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  const remove = (id: string) => {
    deleteRecord(id);
    setRecords(loadRecords());
  };

  return (
    <main className="mx-auto max-w-6xl px-6 pb-20 pt-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-extrabold">Prediction history</h1>
        <p className="mt-1 text-sm text-muted-foreground">All locally saved analyses, newest first.</p>
      </header>

      {records.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-16 text-center">
          <p className="font-semibold">No records yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Run an analysis from the Dashboard to populate history.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {records.map((r) => (
            <article key={r.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              <div className="relative">
                <img src={r.imageDataUrl} alt={r.name} className="h-40 w-full object-cover" />
                <span className="absolute left-3 top-3 rounded-full gradient-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-elegant">
                  {r.result.bloodGroup}
                </span>
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <p className="font-display text-base font-bold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.patientId} · {r.gender} · {r.age}y
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(r.createdAt).toLocaleString()}</span>
                  <span className="font-semibold text-foreground">{(r.result.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => generatePdfReport(r)}
                    className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold transition hover:bg-secondary"
                  >
                    PDF
                  </button>
                  <button
                    onClick={() => remove(r.id)}
                    className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-destructive transition hover:bg-destructive/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

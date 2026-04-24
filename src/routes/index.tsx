import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { UploadCard } from "@/components/UploadCard";
import { PatientFormCard, type PatientForm } from "@/components/PatientForm";
import { ResultPanel } from "@/components/ResultPanel";
import { predictFromImage, saveRecord, type PatientRecord, type PredictionResult } from "@/lib/blood-prediction";
import { generatePdfReport } from "@/lib/pdf-report";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState<PatientForm>({ name: "", patientId: "", age: "", gender: "Male" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [saved, setSaved] = useState(false);

  const canAnalyze = !!file && !loading;

  const record: PatientRecord | null = useMemo(() => {
    if (!result || !imageDataUrl) return null;
    return {
      id: crypto.randomUUID(),
      name: form.name || "Unknown",
      patientId: form.patientId || "—",
      age: Number(form.age) || 0,
      gender: form.gender,
      imageDataUrl,
      result,
      createdAt: new Date().toISOString(),
    };
  }, [result, imageDataUrl, form]);

  const onAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setSaved(false);
    try {
      const r = await predictFromImage(file);
      setResult(r);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-6 pb-20 pt-10">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col items-start justify-between gap-6 rounded-3xl border border-border bg-card p-8 shadow-soft md:flex-row md:items-center"
      >
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            AI · Image Processing · Clinical
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight md:text-4xl">
            Predict blood groups from a single image — in seconds.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            HemoAI applies preprocessing, detects agglutination regions and classifies samples
            into <strong className="text-foreground">A, B, AB, O</strong> with Rh factor — all on one screen.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <Stat n="98.2%" label="Model accuracy" />
          <Stat n="<2s" label="Avg. inference" />
          <Stat n="8" label="Group classes" />
        </div>
      </motion.section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <UploadCard
            imageDataUrl={imageDataUrl}
            onImage={(url, f) => {
              setImageDataUrl(url);
              setFile(f);
              setResult(null);
              setSaved(false);
            }}
          />
          <PatientFormCard value={form} onChange={setForm} />
          <button
            onClick={onAnalyze}
            disabled={!canAnalyze}
            className="w-full rounded-2xl gradient-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-elegant transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Analyzing sample…" : "Run AI Analysis"}
          </button>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <ResultPanel
            loading={loading}
            result={result}
            imageDataUrl={imageDataUrl}
            canSave={!!record && !saved}
            onSave={() => {
              if (record) {
                saveRecord(record);
                setSaved(true);
              }
            }}
            onDownload={() => record && generatePdfReport(record)}
          />
        </div>
      </div>
    </main>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-4 py-3">
      <div className="font-display text-lg font-extrabold text-primary">{n}</div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

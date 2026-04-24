export interface PatientForm {
  name: string;
  patientId: string;
  age: string;
  gender: "Male" | "Female" | "Other";
}

interface Props {
  value: PatientForm;
  onChange: (v: PatientForm) => void;
}

export function PatientFormCard({ value, onChange }: Props) {
  const set = <K extends keyof PatientForm>(k: K, v: PatientForm[K]) => onChange({ ...value, [k]: v });

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <h3 className="mb-4 font-display text-lg font-bold">Patient Details</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name">
          <input
            value={value.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Jane Doe"
            className="input"
          />
        </Field>
        <Field label="Patient ID">
          <input
            value={value.patientId}
            onChange={(e) => set("patientId", e.target.value)}
            placeholder="PT-00421"
            className="input"
          />
        </Field>
        <Field label="Age">
          <input
            type="number"
            min={0}
            max={150}
            value={value.age}
            onChange={(e) => set("age", e.target.value)}
            placeholder="32"
            className="input"
          />
        </Field>
        <Field label="Gender">
          <div className="flex gap-1.5 rounded-xl bg-secondary p-1">
            {(["Male", "Female", "Other"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => set("gender", g)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  value.gender === g ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </Field>
      </div>
      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--color-border);
          background: var(--color-card);
          padding: 0.625rem 0.875rem;
          font-size: 0.9rem;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 4px color-mix(in oklab, var(--color-primary) 15%, transparent);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

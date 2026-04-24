import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  imageDataUrl: string | null;
  onImage: (dataUrl: string, file: File) => void;
}

export function UploadCard({ imageDataUrl, onImage }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    const ok = ["image/jpeg", "image/png", "image/bmp"].includes(file.type) || /\.(jpe?g|png|bmp)$/i.test(file.name);
    if (!ok) {
      setError("Please upload a JPG, PNG, or BMP image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onImage(reader.result as string, file);
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-bold">Sample Image</h3>
          <p className="text-sm text-muted-foreground">Upload a blood smear or fingerprint image</p>
        </div>
        <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
          JPG · PNG · BMP
        </span>
      </div>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
        className={`relative block cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-all ${
          drag ? "border-primary bg-accent/40" : "border-border bg-surface"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/bmp"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {imageDataUrl ? (
          <motion.img
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            src={imageDataUrl}
            alt="Uploaded sample"
            className="h-72 w-full object-cover"
          />
        ) : (
          <div className="flex h-72 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-primary shadow-elegant">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-primary-foreground">
                <path d="M12 16V4m0 0l-4 4m4-4l4 4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="font-semibold">Drop image here or click to browse</p>
              <p className="text-xs text-muted-foreground">High-quality, well-lit images give the best results</p>
            </div>
          </div>
        )}
      </label>

      {error && <p className="mt-3 text-sm font-medium text-destructive">{error}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:bg-secondary"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Choose file
        </button>
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:bg-secondary"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          Use camera
        </button>
      </div>
    </div>
  );
}

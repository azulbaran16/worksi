import { useRef, useState } from "react";
import { Icon } from "../icons.jsx";

const MAX_MB = 5;
const ACCEPT = ".pdf,.doc,.docx,.txt,.rtf";

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function ResumeDropzone({ file, onChange }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  function validateAndSet(f) {
    setError("");
    if (!f) return;
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${MAX_MB}MB.`);
      return;
    }
    const ext = "." + f.name.split(".").pop().toLowerCase();
    if (!ACCEPT.includes(ext)) {
      setError("Unsupported file type. Use PDF, DOC, DOCX, TXT or RTF.");
      return;
    }
    onChange(f);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    validateAndSet(e.dataTransfer.files?.[0]);
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload your resume"
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragging ? "border-brand-500 bg-brand-50" : "border-slate-300 bg-slate-50 hover:border-brand-400 hover:bg-white"
        }`}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
          <Icon.Upload />
        </span>
        <p className="mt-3 text-sm font-semibold text-slate-800">
          Drag &amp; drop your resume here, or <span className="text-brand-700">browse</span>
        </p>
        <p className="mt-1 text-xs text-muted">PDF, DOC, DOCX, TXT or RTF · up to {MAX_MB}MB</p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => validateAndSet(e.target.files?.[0])}
        />
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {file && (
        <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success-500/10 text-success-600">
              <Icon.File width={18} height={18} />
            </span>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
              <p className="text-xs text-muted">{formatSize(file.size)}</p>
            </div>
          </div>
          <button
            type="button"
            className="btn-ghost px-2 text-slate-500 hover:text-red-600"
            aria-label="Remove resume"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
          >
            <Icon.Trash width={18} height={18} />
          </button>
        </div>
      )}
    </div>
  );
}

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { Icon } from "../icons.jsx";

const ToastContext = createContext(null);

const STYLES = {
  success: "border-success-500/30 bg-white text-slate-800",
  error: "border-red-300 bg-white text-slate-800",
  info: "border-brand-200 bg-white text-slate-800",
};
const ICONS = {
  success: <Icon.Check width={18} height={18} className="text-success-600" />,
  error: <Icon.X width={18} height={18} className="text-red-600" />,
  info: <Icon.Shield width={18} height={18} className="text-brand-600" />,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (message, type = "success", duration = 3800) => {
      const id = ++idRef.current;
      setToasts((t) => [...t, { id, message, type }]);
      if (duration) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border ${STYLES[t.type]} px-4 py-3 shadow-lift animate-fade-up`}
          >
            <span className="mt-0.5 shrink-0">{ICONS[t.type]}</span>
            <p className="flex-1 text-sm font-medium">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="shrink-0 text-slate-400 hover:text-slate-600"
              aria-label="Dismiss"
            >
              <Icon.X width={16} height={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Returns toast(message, type?) where type is "success" | "error" | "info".
export function useToast() {
  const ctx = useContext(ToastContext);
  return ctx || (() => {});
}

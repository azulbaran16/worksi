import { useEffect } from "react";

const SUFFIX = "WorkSi — Staffing & Recruitment";

// Sets the browser tab title per page; restores the default on unmount.
export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${SUFFIX}` : SUFFIX;
    return () => {
      document.title = SUFFIX;
    };
  }, [title]);
}

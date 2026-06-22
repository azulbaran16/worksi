import { useEffect } from "react";

const SUFFIX = "WorkSi — Staffing & Recruitment";
const DEFAULT_DESC =
  "WorkSi connects job seekers with temporary, temp-to-perm and permanent opportunities across Canada. Apply in minutes.";

function setMetaDescription(content) {
  let tag = document.querySelector('meta[name="description"]');
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", "description");
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

// Sets the browser tab title (and optional meta description) per page;
// restores defaults on unmount.
export default function useDocumentTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} · ${SUFFIX}` : SUFFIX;
    if (description) setMetaDescription(description);
    return () => {
      document.title = SUFFIX;
      setMetaDescription(DEFAULT_DESC);
    };
  }, [title, description]);
}

import { api } from "../api.js";
import { Icon } from "../icons.jsx";

// Maps the API suggestion list into Autocomplete options.
export async function jobSuggestLoader(query) {
  const items = await api.suggest(query);
  return items.map((i) => ({ label: i.value, value: i.value, type: i.type }));
}

const TYPE_META = {
  title: { Icon: Icon.Briefcase, label: "Job" },
  category: { Icon: Icon.Star, label: "Category" },
  location: { Icon: Icon.MapPin, label: "Location" },
};

// Renders a suggestion row with a leading type icon and a trailing type tag.
export function SuggestionRow(opt) {
  const meta = TYPE_META[opt.type] || TYPE_META.title;
  const M = meta.Icon;
  return (
    <>
      <M width={16} height={16} className="shrink-0 text-slate-400" />
      <span className="flex-1 truncate">{opt.label}</span>
      <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
        {meta.label}
      </span>
    </>
  );
}

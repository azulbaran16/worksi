import { useEffect, useId, useRef, useState } from "react";

/**
 * Accessible combobox with typeahead suggestions.
 *
 * Props:
 *  - value: current input text (controlled)
 *  - onChange(text): called as the user types
 *  - loadOptions(query) => Promise<Option[]> | Option[]   Option = { label, value, type? }
 *  - onSelect(option): called when an option is chosen
 *  - placeholder, icon (component), className, minChars (default 0), openOnFocus
 *  - renderOption(option): optional custom renderer
 */
export default function Autocomplete({
  value,
  onChange,
  loadOptions,
  onSelect,
  placeholder,
  icon: IconComp,
  className = "",
  inputClassName = "",
  minChars = 0,
  openOnFocus = true,
  renderOption,
  "aria-label": ariaLabel,
}) {
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef(null);
  const listId = useId();
  const reqId = useRef(0);

  // Debounced fetch when value changes
  useEffect(() => {
    if (!open) return;
    if ((value || "").length < minChars) {
      setOptions([]);
      return;
    }
    const id = ++reqId.current;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await loadOptions(value || "");
        if (id === reqId.current) {
          setOptions(Array.isArray(res) ? res : []);
          setActive(-1);
        }
      } finally {
        if (id === reqId.current) setLoading(false);
      }
    }, 180);
    return () => clearTimeout(t);
  }, [value, open, minChars, loadOptions]);

  // Close on outside click
  useEffect(() => {
    function onDoc(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function choose(opt) {
    onChange(opt.label);
    onSelect?.(opt);
    setOpen(false);
    setActive(-1);
  }

  function onKeyDown(e) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      if (active >= 0 && options[active]) {
        e.preventDefault();
        choose(options[active]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const showList = open && options.length > 0;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <div className="relative">
        {IconComp && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <IconComp width={18} height={18} />
          </span>
        )}
        <input
          type="text"
          className={`field ${IconComp ? "pl-10" : ""} ${inputClassName}`}
          value={value || ""}
          placeholder={placeholder}
          aria-label={ariaLabel}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => openOnFocus && setOpen(true)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand-500" />
        )}
      </div>

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lift animate-fade-in"
        >
          {options.map((opt, i) => (
            <li
              key={`${opt.value}-${i}`}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(opt);
              }}
              className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm ${
                i === active ? "bg-brand-50 text-brand-800" : "text-slate-700"
              }`}
            >
              {renderOption ? renderOption(opt) : <span>{opt.label}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Entry = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  text: string;
};

const OPEN_EVENT = "open-search";

function runSearch(entries: Entry[], query: string): Entry[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return entries.slice(0, 6);
  const scored: { e: Entry; score: number }[] = [];
  for (const e of entries) {
    const title = e.title.toLowerCase();
    const desc = e.description.toLowerCase();
    const text = e.text.toLowerCase();
    let score = 0;
    let all = true;
    for (const t of terms) {
      const inTitle = title.includes(t);
      const inTags = e.tags.some((x) => x.toLowerCase().includes(t));
      const inDesc = desc.includes(t);
      const inText = text.includes(t);
      if (!(inTitle || inTags || inDesc || inText)) {
        all = false;
        break;
      }
      score +=
        (inTitle ? 5 : 0) + (inTags ? 3 : 0) + (inDesc ? 2 : 0) + (inText ? 1 : 0);
    }
    if (all) scored.push({ e, score });
  }
  return scored.sort((a, b) => b.score - a.score).map((x) => x.e);
}

export function SearchTrigger({ large = false }: { large?: boolean }) {
  return (
    <button
      type="button"
      className={large ? "search-trigger search-trigger-large" : "search-trigger"}
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      aria-label="Search posts"
      aria-keyshortcuts="/ Control+K Meta+K"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <span className="search-trigger-label">
        {large ? "Search posts by title, topic or keyword" : "Search"}
      </span>
      <kbd aria-hidden="true">/</kbd>
    </button>
  );
}

export function SearchDialog() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(
    () => (entries ? runSearch(entries, query) : []),
    [entries, query],
  );

  const load = useCallback(() => {
    if (entries) return;
    fetch("/search-index.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Entry[]) => setEntries(data))
      .catch(() => setFailed(true));
  }, [entries]);

  const open = useCallback(() => {
    const d = dialogRef.current;
    if (!d || d.open) return;
    d.showModal();
    load();
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [load]);

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const onOpen = () => open();
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing =
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT" ||
          el.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open();
      } else if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function go(slug: string) {
    close();
    router.push(`/blog/${slug}`);
  }

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active].slug);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="search-dialog"
      aria-label="Search posts"
      onClose={() => {
        setQuery("");
        setActive(0);
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) close();
      }}
    >
      <div className="search-panel">
        <div className="search-field">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results"
            aria-activedescendant={
              results[active] ? `search-opt-${results[active].slug}` : undefined
            }
            placeholder="Search posts…"
            value={query}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKey}
          />
          <button type="button" className="search-close" onClick={close}>
            Esc
          </button>
        </div>

        <div className="search-body">
          {failed && (
            <p className="search-empty">
              Search is unavailable right now. Try the{" "}
              <a href="/blog">blog index</a> instead.
            </p>
          )}
          {!failed && !entries && <p className="search-empty">Loading…</p>}
          {entries && results.length === 0 && (
            <p className="search-empty">
              Nothing found for “{query}”. Try a shorter or different word.
            </p>
          )}
          {entries && results.length > 0 && (
            <>
              {!query.trim() && <p className="search-hint">Latest posts</p>}
              <ul id="search-results" role="listbox" className="search-results">
                {results.map((r, i) => (
                  <li
                    key={r.slug}
                    id={`search-opt-${r.slug}`}
                    role="option"
                    aria-selected={i === active}
                    className={i === active ? "is-active" : undefined}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r.slug)}
                  >
                    <span className="search-result-title">{r.title}</span>
                    {r.description && (
                      <span className="search-result-desc">{r.description}</span>
                    )}
                    {r.tags.length > 0 && (
                      <span className="search-result-tags">
                        {r.tags.map((t) => `#${t}`).join("  ")}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="search-foot" aria-hidden="true">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> to move
          </span>
          <span>
            <kbd>↵</kbd> to open
          </span>
          <span>
            <kbd>Esc</kbd> to close
          </span>
        </div>
      </div>
    </dialog>
  );
}

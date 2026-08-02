"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

const SearchBar = () => {
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  // Mirror the URL query param into local input state on mount / navigation
  const [query, setQuery] = useState(urlSearchParams.get("q") ?? "");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const searchWrapperRef = useRef(null);
  const debounceRef = useRef(null);

  // Keep input in sync if the user navigates back/forward
  useEffect(() => {
    setQuery(urlSearchParams.get("q") ?? "");
  }, [urlSearchParams]);

  // Close dropdown on outside click
  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  // Debounced live suggestions fetch (desktop only)
  const fetchSuggestions = useCallback(async (q) => {
    if (!q.trim()) {
      setSuggestions([]);
      return;
    }
    setIsFetching(true);
    try {
      const res = await fetch(
        `/api/search-history/suggestions?q=${encodeURIComponent(q)}`,
      );
      const data = await res.json();
      // Show top 8 keywords as suggestions
      setSuggestions((data.keywords ?? []).slice(0, 8));
    } catch {
      setSuggestions([]);
    } finally {
      setIsFetching(false);
    }
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    // Only show live suggestions on desktop
    if (window.innerWidth >= 560) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchSuggestions(val), 350);
    }
  };

  const navigate = useCallback(
    (q) => {
      const trimmed = q.trim();
      if (trimmed) {
        // Fire-and-forget: save search history asynchronously without blocking navigation
        // navigator.sendBeacon is perfect for this - it won't block the user action
        const blob = new Blob([JSON.stringify({ keyword: trimmed })], {
          type: "application/json",
        });
        navigator.sendBeacon("/api/search-history/save", blob);

        router.push(`/?q=${encodeURIComponent(trimmed)}`);
      } else {
        router.push("/");
      }
      setIsSearchOpen(false);
    },
    [router],
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      navigate(query);
    }
    if (e.key === "Escape") {
      setIsSearchOpen(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    router.push("/");
    setIsSearchOpen(false);
  };

  const hasQuery = query.trim().length > 0;

  return (
    <div className="relative flex min-w-0 flex-1 items-center justify-center px-1 sm:px-2 md:px-4">
      <div
        ref={searchWrapperRef}
        className="relative w-full min-w-0 max-w-none ms:max-w-xl lg:max-w-2xl"
      >
        {/* Search input */}
        <div className="flex min-w-0 items-center gap-1.5 rounded-full bg-gray-100 px-2 py-1.5 transition-all hover:bg-gray-200 focus-within:bg-gray-200 ms:gap-2 ms:px-4 ms:py-2">
          <MagnifyingGlassIcon className="h-4 w-4 shrink-0 text-gray-400 ms:h-5 ms:w-5" />
          <input
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (window.innerWidth >= 560) setIsSearchOpen(true);
            }}
            onClick={() => {
              if (window.innerWidth >= 560) setIsSearchOpen(true);
            }}
            placeholder="Search for products, vendors..."
            className="w-full min-w-0 bg-transparent text-[11px] text-gray-700 outline-none placeholder-gray-500 ms:text-sm"
            aria-label="Search listings"
          />

          {/* Clear button — shown when there's text */}
          {hasQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-white/70 hover:text-gray-600"
              aria-label="Clear search"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}

          {/* ⌘ toggle — desktop only */}
          {!hasQuery && (
            <button
              type="button"
              onClick={() => {
                if (window.innerWidth >= 560) {
                  setIsSearchOpen((c) => !c);
                }
              }}
              className="ml-auto h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-white/70 hover:text-gray-600 ms:h-8 ms:w-8 hidden ss:flex"
              aria-label="Toggle search suggestions"
            >
              <span className="text-sm leading-none ms:text-lg">⌘</span>
            </button>
          )}
        </div>

        {/* Desktop suggestions dropdown */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="hidden ss:block ss:absolute ss:inset-x-0 ss:top-full ss:mt-2 ss:rounded-[28px] ss:border ss:border-gray-200 ss:bg-white ss:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.24)] z-50 overflow-hidden"
            >
              <div className="no-scrollbar max-h-[70vh] overflow-y-auto px-6 py-5">
                {/* Header row */}
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500 ms:text-xs">
                    {hasQuery ? "Results" : "Popular Searches"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="text-[10px] font-medium text-emerald-600 hover:text-emerald-700 ms:text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                {/* Live results when user has typed something */}
                {hasQuery ? (
                  isFetching ? (
                    <div className="flex items-center gap-2 py-4 text-sm text-gray-400">
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-emerald-500" />
                      Searching…
                    </div>
                  ) : suggestions.length > 0 ? (
                    <ul className="space-y-1">
                      {suggestions.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => navigate(item.keyword)}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <MagnifyingGlassIcon className="h-4 w-4 shrink-0 text-gray-400" />
                            <span className="line-clamp-1 font-medium">
                              {item.keyword}
                            </span>
                          </button>
                        </li>
                      ))}
                      <li>
                        <button
                          type="button"
                          onClick={() => navigate(query)}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors mt-1"
                        >
                          <MagnifyingGlassIcon className="h-4 w-4 shrink-0" />
                          Search for "{query}"
                        </button>
                      </li>
                    </ul>
                  ) : (
                    <p className="py-4 text-sm text-gray-400">
                      No suggestions for &ldquo;{query}&rdquo;. Press Enter to
                      search.
                    </p>
                  )
                ) : (
                  /* Static popular searches when input is empty */
                  <div className="space-y-6">
                    <section>
                      <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500 ms:text-xs">
                        Popular Categories
                      </h4>
                      <div className="flex flex-wrap gap-2.5">
                        {[
                          "Electronics",
                          "Books",
                          "Fashion",
                          "Hostels",
                          "Gadgets",
                          "Skincare",
                        ].map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setQuery(item);
                              navigate(item);
                            }}
                            className="rounded-full border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 ms:px-4 ms:py-2.5 ms:text-sm"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </section>
                    <section>
                      <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500 ms:text-xs">
                        Trending
                      </h4>
                      <div className="flex flex-wrap gap-2.5">
                        {[
                          "Bose QC45",
                          "iPhone",
                          "Student Desk",
                          "Campus Hostel",
                        ].map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setQuery(item);
                              navigate(item);
                            }}
                            className="rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 transition hover:bg-white hover:border-emerald-200 ms:px-4 ms:py-2.5 ms:text-sm"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </section>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchBar;

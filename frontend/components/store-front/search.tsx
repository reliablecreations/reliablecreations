"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/search?q=${q}`);
  };

  const clearSearch = () => {
    setQ("");
    router.push(`/search`);
  };

  return (
    <div className="header-search-bar">
      <form onSubmit={handleSearch}>
        <div className="search-info p-relative">
          <button className="header-search-icon">
            <i className="fal fa-search" />
          </button>
          <input
            type="text"
            placeholder="Search products..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {q && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={clearSearch}
            >
              <i className="fal fa-times" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

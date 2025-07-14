"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMediaQuery } from "react-responsive";

interface SearchProps {
  mobileonly?: boolean;
}

export default function Search({ mobileonly }: SearchProps) {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

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

  if (isMobile && mobileonly)
    return (
      <div className="header-search-bar px-2 pb-2">
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
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#000",
                  cursor: "pointer",
                  background: "white",
                  padding: "5px",
                }}
                onClick={clearSearch}
              >
                <i className="fal fa-times" />
              </button>
            )}
          </div>
        </form>
      </div>
    );

  if (!isMobile && !mobileonly)
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
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#000",
                  cursor: "pointer",
                  background: "white",
                  padding: "5px",
                }}
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

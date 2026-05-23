"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "./ThemeProvider";
import Icon from "./Icons";

function SearchInput({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Update query param or route to main page
    if (pathname !== "/") {
      router.push(`/?q=${encodeURIComponent(value)}`);
    } else {
      const params = new URLSearchParams(window.location.search);
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      router.replace(`/?${params.toString()}`);
    }
  };

  return (
    <div className="relative w-full">
      <Icon
        name="Search"
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />
      <input
        type="text"
        placeholder="Search Cognoras..."
        value={searchQuery}
        onChange={handleSearchChange}
        className={className}
      />
    </div>
  );
}

function SearchInputFallback({ className }: { className?: string }) {
  return (
    <div className="relative w-full">
      <Icon
        name="Search"
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />
      <input
        type="text"
        placeholder="Search articles..."
        disabled
        className={className}
      />
    </div>
  );
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout, setAuthModalOpen, setAuthModalView } = useAuth();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[1000] bg-card border-b border-border/50 transition-all duration-200">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex h-14 items-center justify-between gap-4">
            {/* LEFT — Logo + Brand */}
            <Link href="/" className="flex items-center gap-3 no-underline shrink-0">
              <div className="h-10 w-10 overflow-hidden rounded-lg border border-border/20 bg-muted">
                <img
                  src="/logo.jpeg"
                  alt="Cognoras logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <img
                src={theme === "dark" ? "/lightlogo.png" : "/darklogo.png"}
                alt="Cognoras"
                className="h-8.5 object-contain"
              />
            </Link>

            {/* CENTER — Search (desktop) */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <Suspense
                fallback={
                  <SearchInputFallback className="w-full h-9 pl-9 pr-4 rounded-full bg-muted/60 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                }
              >
                <SearchInput className="w-full h-9 pl-9 pr-4 rounded-full bg-muted/60 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
              </Suspense>
            </div>

            {/* RIGHT — Actions */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                <Icon
                  name={theme === "dark" ? "Sun" : "Moon"}
                  size={20}
                  className="text-foreground"
                />
              </button>

              {/* Write button (desktop) */}
              {isAuthenticated ? (
                <Link
                  href="/write"
                  className="hidden sm:flex items-center gap-2 h-9 px-4 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors no-underline"
                >
                  <Icon name="Edit3" size={16} />
                  <span>Write</span>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalView("signup");
                    setAuthModalOpen(true);
                  }}
                  className="hidden sm:flex items-center gap-2 h-9 px-4 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors border-none cursor-pointer"
                >
                  <Icon name="Edit3" size={16} />
                  <span>Write</span>
                </button>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Icon
                  name={isMobileMenuOpen ? "X" : "Menu"}
                  size={22}
                  className="text-foreground"
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-[1040] bg-card transform transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? "translate-x-0 visible" : "translate-x-full invisible"
        }`}
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted"
          aria-label="Close menu"
        >
          <Icon name="X" size={24} className="text-foreground" />
        </button>

        <div className="pt-20 px-6 pb-6 flex flex-col h-full">
          {/* Mobile search */}
          <div className="relative mb-6">
            <Suspense
              fallback={
                <SearchInputFallback className="w-full h-10 pl-9 pr-4 rounded-full bg-muted/60 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
              }
            >
              <SearchInput className="w-full h-10 pl-9 pr-4 rounded-full bg-muted/60 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
            </Suspense>
          </div>

          {/* Mobile nav links */}
          <nav className="flex flex-col gap-1 mb-6">
            <Link
              href="/?view=home"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted font-medium transition-all"
            >
              <Icon name="Home" size={20} />
              Home
            </Link>
            <Link
              href="/?view=profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted font-medium transition-all"
            >
              <Icon name="User" size={20} />
              Profile
            </Link>
            <Link
              href="/?view=articles"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted font-medium transition-all"
            >
              <Icon name="Layout" size={20} />
              Your Stories
            </Link>
            {isAuthenticated ? (
              <Link
                href="/write"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted font-medium transition-all no-underline"
              >
                <Icon name="Edit3" size={20} />
                Write
              </Link>
            ) : (
              <button
                onClick={() => {
                  setAuthModalView("signup");
                  setAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted font-medium transition-all w-full text-left bg-transparent border-none cursor-pointer"
              >
                <Icon name="Edit3" size={20} />
                Write
              </button>
            )}
          </nav>

          {/* Mobile bottom actions */}
          <div className="flex flex-col gap-3 pt-6 border-t border-border mt-auto">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  router.push("/login");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition shadow-md"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

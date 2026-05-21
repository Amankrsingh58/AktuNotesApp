"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Icon from "./Icons";

interface SidebarProps {
  activeView?: string;
  setActiveView?: (key: string) => void;
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  const sidebarItems = [
    { key: "home", icon: "Home", label: "Home" },
    { key: "profile", icon: "User", label: "Profile" },
    { key: "articles", icon: "Layout", label: "Articles" },
  ];

  const handleItemClick = (key: string) => {
    if (pathname !== "/") {
      // Navigate to home and pass route view state in query param
      router.push(`/?view=${key}`);
    } else if (setActiveView) {
      setActiveView(key);
    } else {
      router.push(`/?view=${key}`);
    }
  };

  const handleLogoutClick = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <aside className="hidden md:flex flex-col items-center w-[64px] shrink-0 border-r border-border/50 bg-card/50 sticky top-14 h-[calc(100vh-56px)] pt-8 pb-4 justify-between">
      <nav className="flex flex-col items-center gap-1">
        {sidebarItems.map((item) => (
          <button
            key={item.key}
            onClick={() => handleItemClick(item.key)}
            title={item.label}
            className={`group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
              activeView === item.key
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon name={item.icon} size={20} />
            {/* Tooltip */}
            <span className="absolute left-full ml-2 px-2 py-1 rounded-md bg-foreground text-background text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Bottom — Logout */}
      {isAuthenticated && (
        <button
          onClick={handleLogoutClick}
          title="Logout"
          className="group relative w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 cursor-pointer"
        >
          <Icon name="LogOut" size={20} />
          <span className="absolute left-full ml-2 px-2 py-1 rounded-md bg-foreground text-background text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50">
            Logout
          </span>
        </button>
      )}
    </aside>
  );
}

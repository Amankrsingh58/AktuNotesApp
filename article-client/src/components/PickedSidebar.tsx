"use client";

import React from "react";
import Link from "next/link";
import { Article } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import Icon from "./Icons";

interface PickedSidebarProps {
  articles: Article[];
}

export default function PickedSidebar({ articles }: PickedSidebarProps) {
  const { isAuthenticated, setAuthModalOpen, setAuthModalView } = useAuth();
  
  const picks = articles.slice(0, 3);

  return (
    <aside aria-label="Recommended articles" className="hidden lg:block lg:w-[360px] border-l border-border pl-12 h-fit sticky top-24">
      <div className="space-y-10">
        <div>
          <h3 className="text-sm font-bold text-foreground mb-4">Staff Picks</h3>
          <div className="space-y-6">
            {picks.map((art) => {
              const authorPic =
                art.author?.profilePic ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  art.author?.name || "Author"
                )}&background=random`;

              return (
                <div key={art._id} className="group cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src={authorPic}
                      className="w-5 h-5 rounded-full object-cover"
                      alt={art.author?.name || "Author"}
                      width={20}
                      height={20}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="text-xs font-medium text-foreground">
                      {art.author?.name}
                    </span>
                  </div>
                  <Link href={`/articles/${art.slug}`}>
                    <h4 className="text-sm font-bold text-foreground group-hover:underline">
                      {art.title}
                    </h4>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 bg-primary/10 rounded-xl border border-primary/20">
          <h4 className="font-bold text-foreground mb-2">Writing on Cognora</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Share your knowledge — write articles about AI, tech, engineering, and more.
          </p>
          {isAuthenticated ? (
            <Link
              href="/write"
              className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-all no-underline"
            >
              Start writing
            </Link>
          ) : (
            <button
              onClick={() => {
                setAuthModalView("signup");
                setAuthModalOpen(true);
              }}
              className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-all border-none cursor-pointer"
            >
              Start writing
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

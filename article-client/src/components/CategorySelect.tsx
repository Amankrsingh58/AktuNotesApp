"use client";

import { useEffect, useState } from "react";
import { ARTICLE_CATEGORIES } from "@/lib/categories";

type Props = { value: string; onChange: (value: string) => void; className?: string };

export default function CategorySelect({ value, onChange, className = "" }: Props) {
  const isPreset = ARTICLE_CATEGORIES.some((category) => category === value);
  const [customSelected, setCustomSelected] = useState(Boolean(value && !isPreset));

  useEffect(() => {
    if (value && !ARTICLE_CATEGORIES.some((category) => category === value)) setCustomSelected(true);
  }, [value]);

  const selection = customSelected ? "custom" : value;
  return <div className={`space-y-2 ${className}`}>
    <select value={selection} onChange={(event) => {
      const next = event.target.value;
      const custom = next === "custom";
      setCustomSelected(custom);
      onChange(custom ? "" : next);
    }} className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
      <option value="">Select a category</option>
      {ARTICLE_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
      <option value="custom">Other — write your own</option>
    </select>
    {customSelected && <input autoFocus value={value} onChange={(event) => onChange(event.target.value)} maxLength={80} placeholder="Enter a custom category" className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />}
  </div>;
}

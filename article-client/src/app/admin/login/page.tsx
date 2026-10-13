"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data?.role !== "super_admin") { await api.post("/auth/logout"); throw new Error("Cognora analytics requires a super-admin account."); }
      router.replace("/admin");
    } catch (cause: unknown) {
      const message = cause && typeof cause === "object" && "response" in cause ? (cause as { response?: { data?: { message?: string } } }).response?.data?.message : cause instanceof Error ? cause.message : "Unable to sign in";
      setError(message || "Unable to sign in");
    } finally { setLoading(false); }
  };
  return <main className="min-h-screen bg-background px-4 py-24 text-foreground">
    <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-7 shadow-xl sm:p-9">
      <Link href="/" className="text-sm font-semibold text-primary">← Back to Cognora</Link>
      <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-primary">Protected workspace</p>
      <h1 className="mt-2 text-3xl font-bold">Cognora Admin</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">Sign in with an existing super-admin account to view analytics and manage articles.</p>
      <form onSubmit={submit} className="mt-8 space-y-5">
        <label className="block"><span className="mb-2 block text-sm font-semibold">Email</span><input type="email" required autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
        <label className="block"><span className="mb-2 block text-sm font-semibold">Password</span><input type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
        {error && <p className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
        <button disabled={loading} className="h-11 w-full rounded-xl bg-primary font-semibold text-primary-foreground disabled:opacity-60">{loading ? "Signing in…" : "Sign in securely"}</button>
      </form>
    </div>
  </main>;
}

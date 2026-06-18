"use client";

import React, { useMemo, useState } from "react";
import AuthModal from "@/components/AuthModal";
import Header from "@/components/Header";
import Icon from "@/components/Icons";
import { useAuth } from "@/contexts/AuthContext";

type BioLink = {
  id: string;
  title: string;
  url: string;
  description?: string;
  isActive: boolean;
};

type LinkFormState = {
  title: string;
  url: string;
  description: string;
  isActive: boolean;
};

const initialLinks: BioLink[] = [
  {
    id: "official-community",
    title: "Join the Cognora Community",
    url: "https://cognora.in",
    description: "Articles, updates, and resources for curious builders.",
    isActive: true,
  },
  {
    id: "latest-articles",
    title: "Read Latest Articles",
    url: "https://cognora.in",
    description: "Fresh notes on AI, software engineering, and tech trends.",
    isActive: true,
  },
  {
    id: "creator-notes",
    title: "Creator Notes",
    url: "https://cognora.in",
    description: "Hidden draft link example for admin preview.",
    isActive: false,
  },
];

const emptyForm: LinkFormState = {
  title: "",
  url: "",
  description: "",
  isActive: true,
};

const normalizeUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

export default function LinksinPage() {
  const { user, isLoading } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";

  const [links, setLinks] = useState<BioLink[]>(initialLinks);
  const [form, setForm] = useState<LinkFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const visibleLinks = useMemo(() => {
    return isSuperAdmin ? links : links.filter((link) => link.isActive);
  }, [isSuperAdmin, links]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSuperAdmin) return;

    const nextLink = {
      title: form.title.trim(),
      url: normalizeUrl(form.url),
      description: form.description.trim(),
      isActive: form.isActive,
    };

    if (!nextLink.title || !nextLink.url) return;

    if (editingId) {
      setLinks((current) =>
        current.map((link) =>
          link.id === editingId ? { ...link, ...nextLink } : link
        )
      );
    } else {
      setLinks((current) => [
        {
          id: `link-${Date.now()}`,
          ...nextLink,
        },
        ...current,
      ]);
    }

    resetForm();
  };

  const startEdit = (link: BioLink) => {
    if (!isSuperAdmin) return;
    setEditingId(link.id);
    setForm({
      title: link.title,
      url: link.url,
      description: link.description || "",
      isActive: link.isActive,
    });
    setIsFormOpen(true);
  };

  const deleteLink = (id: string) => {
    if (!isSuperAdmin) return;
    setLinks((current) => current.filter((link) => link.id !== id));
    if (editingId === id) resetForm();
  };

  const toggleLinkStatus = (id: string) => {
    if (!isSuperAdmin) return;
    setLinks((current) =>
      current.map((link) =>
        link.id === id ? { ...link, isActive: !link.isActive } : link
      )
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <AuthModal />
      <Header />

      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-12 pt-24 sm:px-6">
        <section className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted">
            <img
              src="/mainlogo.jpeg"
              alt="Cognora"
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Cognora Links
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Quick access to important Cognora pages, resources, and community updates.
          </p>
        </section>

        {isSuperAdmin && (
          <section className="mb-6 rounded-lg border border-border bg-card p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Link Manager
                </h2>
                <p className="text-sm text-muted-foreground">
                  Add, edit, hide, show, or remove bio links.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen((open) => !open);
                  if (isFormOpen) resetForm();
                }}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                <Icon name={isFormOpen ? "X" : "Plus"} size={16} />
                {isFormOpen ? "Close" : "Add Link"}
              </button>
            </div>

            {isFormOpen && (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-foreground">
                      Title
                    </span>
                    <input
                      value={form.title}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          title: event.target.value,
                        }))
                      }
                      placeholder="Instagram, Portfolio, Latest post"
                      className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-primary/30"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-foreground">
                      URL
                    </span>
                    <input
                      value={form.url}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          url: event.target.value,
                        }))
                      }
                      placeholder="https://example.com"
                      className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-primary/30"
                      required
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-medium text-foreground">
                    Description
                  </span>
                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Optional short helper text"
                    rows={3}
                    className="mt-1 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-primary/30"
                  />
                </label>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <label className="inline-flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          isActive: event.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-input accent-primary"
                    />
                    Active and visible to public users
                  </label>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="h-10 rounded-lg border border-border px-4 text-sm font-semibold text-foreground transition hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                    >
                      {editingId ? "Save Changes" : "Create Link"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </section>
        )}

        <section className="space-y-3">
          {visibleLinks.length > 0 ? (
            visibleLinks.map((link) => (
              <article
                key={link.id}
                className={`rounded-lg border bg-card p-4 shadow-sm transition hover:border-primary/40 ${
                  link.isActive ? "border-border" : "border-dashed border-warning/60 opacity-75"
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group min-w-0 flex-1 no-underline"
                    aria-label={`Open ${link.title} in a new tab`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon name="ExternalLink" size={18} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-base font-semibold text-foreground group-hover:text-primary">
                          {link.title}
                        </span>
                        {link.description && (
                          <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                            {link.description}
                          </span>
                        )}
                        {isSuperAdmin && !link.isActive && (
                          <span className="mt-2 inline-flex rounded-full bg-warning/10 px-2 py-1 text-xs font-semibold text-warning">
                            Hidden from public
                          </span>
                        )}
                      </span>
                    </div>
                  </a>

                  {isSuperAdmin && (
                    <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                      <button
                        type="button"
                        onClick={() => toggleLinkStatus(link.id)}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition hover:bg-muted"
                        title={link.isActive ? "Hide link" : "Show link"}
                      >
                        <Icon name={link.isActive ? "EyeOff" : "Eye"} size={16} />
                        {link.isActive ? "Hide" : "Show"}
                      </button>
                      <button
                        type="button"
                        onClick={() => startEdit(link)}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition hover:bg-muted"
                      >
                        <Icon name="Pencil" size={16} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteLink(link.id)}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-destructive/40 px-3 text-sm font-medium text-destructive transition hover:bg-destructive/10"
                      >
                        <Icon name="Trash2" size={16} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
              No active links are available right now.
            </div>
          )}
        </section>

        {!isLoading && !isSuperAdmin && (
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Only active links are shown here.
          </p>
        )}
      </main>
    </div>
  );
}

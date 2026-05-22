"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import Icon from "./Icons";
import toast from "react-hot-toast";

export default function AuthModal() {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalView,
    setAuthModalView,
    login,
  } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (authModalView === "login") {
        const res = await api.post("/article-user/login", {
          email: formData.email,
          password: formData.password,
        });
        login(res.data.user);
        toast.success("Login successful!");
      } else {
        const res = await api.post("/article-user/register", formData);
        login(res.data.user);
        toast.success("Registration successful!");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative max-w-md w-full bg-card border border-border p-8 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition"
        >
          <Icon name="X" size={20} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {authModalView === "login" ? "Welcome Back" : "Join Community"}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {authModalView === "login"
              ? "Log in to interact with articles"
              : "Create an account to start contributing"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalView === "signup" && (
            <div>
              <label className="text-xs font-semibold text-foreground ml-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground text-sm"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-foreground ml-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground ml-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground text-sm"
            />
          </div>

          {authModalView === "signup" && (
            <div>
              <label className="text-xs font-semibold text-foreground ml-1">
                Bio / Profession
              </label>
              <textarea
                name="bio"
                placeholder="Software Developer, Student, Writer..."
                value={formData.bio}
                onChange={handleChange}
                rows={2}
                className="w-full mt-1 px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground text-sm resize-none"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition shadow-md disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : authModalView === "login"
              ? "Log In"
              : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            {authModalView === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              onClick={() =>
                setAuthModalView(authModalView === "login" ? "signup" : "login")
              }
              className="text-primary font-bold hover:underline ml-1"
            >
              {authModalView === "login" ? "Create Account" : "Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

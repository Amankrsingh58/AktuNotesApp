"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    year: "",
    college: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/user/register", formData);
      login(res.data.user);
      toast.success("Registration successful!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-card border border-border p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground mt-2">Join our student community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground ml-1">
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
          <div>
            <label className="text-sm font-medium text-foreground ml-1">
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
            <label className="text-sm font-medium text-foreground ml-1">
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground ml-1">
                Current Year
              </label>
              <select
                name="year"
                required
                value={formData.year}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground text-sm"
              >
                <option value="">Select</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground ml-1">
                College
              </label>
              <input
                type="text"
                name="college"
                placeholder="College Name"
                required
                value={formData.college}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none text-foreground text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition shadow-lg disabled:opacity-50 mt-4"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground mb-4">Already have an account?</p>
          <Link
            href="/login"
            className="inline-block w-full py-3 px-4 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition text-center text-sm"
          >
            Log In to Your Account
          </Link>
        </div>
      </div>
    </div>
  );
}

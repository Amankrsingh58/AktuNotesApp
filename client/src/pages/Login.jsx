import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/AppIcon";
import { useLoginMutation } from "../store/api/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../store/slices/authSlice";
import { useGetDashboardPyqsQuery } from "../features/pyq/pyqApi";
import SEO from "../components/SEO";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState("");

  // redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin-dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login(formData).unwrap();

      // Save user info + role in Redux (UI only)
      dispatch(setAuth({ user: res.user, role: res.role, isAuthenticated: res.isAuthenticated }));

      // Navigate to dashboard
      navigate("/admin-dashboard");
    } catch (err) {
      setError(err?.data?.message || "Login failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <SEO
        title="Admin Login – AKTU Notes"
        description="Login to the AKTU Notes admin dashboard to manage notes and PYQs."
        path="/admin-login"
      />
      <div className="w-full max-w-md bg-card border rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <Icon name="BookOpen" size={28} className="text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">
            Login to Notes App
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Access your notes and previous year questions
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 text-sm text-red-500 text-center">{error}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="student@email.com"
              className="w-full px-4 py-2.5 border text-foreground rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none text-foreground"
            />
          </div>

          {/* Forgot password */}
          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              className="cursor-pointer text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full cursor-pointer py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

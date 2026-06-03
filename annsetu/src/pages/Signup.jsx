import { motion } from 'framer-motion';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { signup as signupAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

// ─── Zod schema ──────────────────────────────────────────────
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({}); // Zod per-field errors

  const { mutate: signupMutate, isPending, isError, error } = useMutation({
    mutationFn: signupAPI,
    onSuccess: (res) => {
      // Auto-login after signup if backend returns token
      if (res.data.token) {
        login(res.data.token, res.data.user);
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side Zod validation first
    const result = signupSchema.safeParse(form);
    if (!result.success) {
      const errors = {};
      result.error.issues.forEach((err) => {
        errors[err.path[0]] = err.message;
      });

      setFieldErrors(errors);
      return;
    }

    signupMutate(form);
  };

  return (
    <section className="min-h-screen bg-[#f8f8f8] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">
            Join Ann<span className="text-red-500">❤</span>setu
          </h2>
          <p className="text-sm text-gray-500 mt-2">Create an account to start your journey</p>
        </div>

        {/* API Error from backend */}
        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
            {error?.response?.data?.message || "Signup failed. Try again."}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className={`w-full mt-1 px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-orange-400 ${
                fieldErrors.name ? "border-red-400" : ""
              }`}
            />
            {fieldErrors.name && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full mt-1 px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-orange-400 ${
                fieldErrors.email ? "border-red-400" : ""
              }`}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password (min 6 chars)"
              className={`w-full mt-1 px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-orange-400 ${
                fieldErrors.password ? "border-red-400" : ""
              }`}
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isPending}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-2 rounded-xl font-semibold transition mt-4"
          >
            {isPending ? "Creating account..." : "Sign Up"}
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </section>
  );
}

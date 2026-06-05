import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { signupNgo } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { validateNgoStep } from "../validations/ngoSignupValidation";
import { Building2, MapPin, Phone, Utensils, Clock, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";

const STEPS = ["Account", "Organisation", "Preferences"];

const INITIAL = {
  // Step 1 — Account
  name: "", email: "", password: "",
  // Step 2 — Organisation
  orgName: "", description: "", registrationNo: "",
  address: "", city: "", state: "", pincode: "",
  contactPhone: "", website: "",
  // Step 3 — Preferences
  capacityMeals: "",
  dietaryPref: ["Vegetarian"],
  acceptedFoodTypes: ["Cooked Food", "Raw Ingredients", "Packaged Food"],
  operatingHours: "9AM - 6PM",
  focusArea: "All",
};

function toggle(arr, val) {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

function FieldError({ msg }) {
  return msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null;
}

function Input({ label, error, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className={`w-full mt-1 px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm ${
          error ? "border-red-400 bg-red-50" : "border-gray-200"
        }`}
      />
      <FieldError msg={error} />
    </div>
  );
}

export default function NgoSignup() {
  const { login } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validate = () => {
    const e = validateNgoStep(step, form);
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: signupNgo,
    onSuccess: (res) => {
      setSubmitted(true);
      // NGO accounts need admin approval — don't auto-login to dashboard
      // But we do store token so they can access their own profile later
      if (res.data.token) {
        login(res.data.token, res.data.user);
      }
    },
  });

  const next = () => { if (validate()) setStep((s) => s + 1); };
  const back = () => setStep((s) => s - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    mutate({ ...form, role: "NGO", capacityMeals: Number(form.capacityMeals) });
  };

  // ── Success screen ─────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center"
        >
          <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
            Application Submitted! 🎉
          </h2>
          <p className="text-gray-600 mb-2">
            Your NGO <span className="font-bold text-orange-500">{form.orgName}</span> has been registered.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Our team will review your application and verify your NGO within 24-48 hours. Once approved, you'll appear in the NGO directory.
          </p>
          <Link
            to="/"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-semibold transition-colors"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-linear-to-r from-orange-500 to-red-500 p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Building2 size={24} />
            <h1 className="text-2xl font-extrabold">Register Your NGO</h1>
          </div>
          <p className="text-orange-100 text-sm">
            Join Annsetu's verified network and start receiving food donations.
          </p>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mt-6">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i < step ? "bg-white text-orange-500" :
                    i === step ? "bg-white/30 text-white border-2 border-white" :
                    "bg-white/10 text-white/50"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <span className={`text-xs font-medium ${i === step ? "text-white" : "text-white/60"}`}>
                  {s}
                </span>
                {i < STEPS.length - 1 && <div className="w-6 h-px bg-white/30 mx-1" />}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()} className="p-8">
          {isError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
              {error?.response?.data?.message || "Registration failed. Please try again."}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* ── Step 0: Account ───────────────────────────────── */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
                <h2 className="font-bold text-gray-800 text-lg mb-4">Contact Person Account</h2>
                <Input label="Your Name (Contact Person)" name="name" value={form.name}
                  onChange={(e) => set("name", e.target.value)} placeholder="Priya Sharma" error={errors.name} />
                <Input label="Email Address" type="email" name="email" value={form.email}
                  onChange={(e) => set("email", e.target.value)} placeholder="ngo@example.org" error={errors.email} />
                <Input label="Password" type="password" name="password" value={form.password}
                  onChange={(e) => set("password", e.target.value)} placeholder="Min 6 characters" error={errors.password} />
              </motion.div>
            )}

            {/* ── Step 1: Organisation ──────────────────────────── */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
                <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2"><Building2 size={20} className="text-orange-500" /> Organisation Details</h2>
                <Input label="Organisation Name *" name="orgName" value={form.orgName}
                  onChange={(e) => set("orgName", e.target.value)} placeholder="Asha Foundation" error={errors.orgName} />
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea rows={2} value={form.description} onChange={(e) => set("description", e.target.value)}
                    placeholder="Brief description of your NGO's work..."
                    className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm resize-none" />
                </div>
                <Input label="NGO Registration Number (optional)" name="registrationNo" value={form.registrationNo}
                  onChange={(e) => set("registrationNo", e.target.value)} placeholder="NGO/DL/2018/0012345" />
                <Input label="Full Address *" name="address" value={form.address}
                  onChange={(e) => set("address", e.target.value)} placeholder="12, Main Street, Lajpat Nagar" error={errors.address} />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="City *" name="city" value={form.city}
                    onChange={(e) => set("city", e.target.value)} placeholder="Delhi" error={errors.city} />
                  <Input label="State" name="state" value={form.state}
                    onChange={(e) => set("state", e.target.value)} placeholder="Delhi" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Pincode" name="pincode" value={form.pincode}
                    onChange={(e) => set("pincode", e.target.value)} placeholder="110024" />
                  <Input label="Contact Phone *" name="contactPhone" value={form.contactPhone}
                    onChange={(e) => set("contactPhone", e.target.value)} placeholder="9876543210" error={errors.contactPhone} />
                </div>
                <Input label="Website (optional)" name="website" value={form.website}
                  onChange={(e) => set("website", e.target.value)} placeholder="https://yourngos.org" />
              </motion.div>
            )}

            {/* ── Step 2: Preferences ───────────────────────────── */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
                <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2"><Utensils size={20} className="text-orange-500" /> Food Preferences</h2>

                <Input label="Daily meal capacity *" type="number" name="capacityMeals" value={form.capacityMeals}
                  onChange={(e) => set("capacityMeals", e.target.value)} placeholder="e.g. 100" error={errors.capacityMeals} />

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Dietary Preference *</label>
                  <div className="flex gap-2 flex-wrap">
                    {["Vegetarian", "Non-Vegetarian", "Vegan"].map((d) => (
                      <button key={d} type="button"
                        onClick={() => set("dietaryPref", toggle(form.dietaryPref, d))}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                          form.dietaryPref.includes(d)
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                        }`}
                      >{d}</button>
                    ))}
                  </div>
                  <FieldError msg={errors.dietaryPref} />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Accepted Food Types</label>
                  <div className="flex gap-2 flex-wrap">
                    {["Cooked Food", "Raw Ingredients", "Packaged Food"].map((t) => (
                      <button key={t} type="button"
                        onClick={() => set("acceptedFoodTypes", toggle(form.acceptedFoodTypes, t))}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                          form.acceptedFoodTypes.includes(t)
                            ? "bg-gray-800 text-white border-gray-800"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                        }`}
                      >{t}</button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input label="Operating Hours" name="operatingHours" value={form.operatingHours}
                    onChange={(e) => set("operatingHours", e.target.value)} placeholder="9AM - 6PM" />
                  <Input label="Focus Area" name="focusArea" value={form.focusArea}
                    onChange={(e) => set("focusArea", e.target.value)} placeholder="Children, Elderly, All" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
            {step > 0 ? (
              <button type="button" onClick={back}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium text-sm">
                <ChevronLeft size={18} /> Back
              </button>
            ) : (
              <Link to="/signup" className="text-sm text-gray-500 hover:text-gray-700">
                Donor signup instead →
              </Link>
            )}

            {step < 2 ? (
              <button type="button" onClick={next}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors">
                Next <ChevronRight size={18} />
              </button>
            ) : (
              <button type="submit" disabled={isPending}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors">
                {isPending ? "Submitting..." : "Submit Application ✓"}
              </button>
            )}
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-500 hover:underline">Login</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

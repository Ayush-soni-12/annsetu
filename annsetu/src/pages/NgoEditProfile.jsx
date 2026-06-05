import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMyNgoProfile, useUpdateNgoProfile } from "../hooks/useNgos";
import { Building2, Save, ChevronLeft, Loader2 } from "lucide-react";

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm"
      />
    </div>
  );
}

export default function NgoEditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({});

  const { data: profile, isLoading } = useMyNgoProfile();

  useEffect(() => {
    if (profile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        orgName: profile.orgName || "",
        description: profile.description || "",
        registrationNo: profile.registrationNo || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        pincode: profile.pincode || "",
        contactPhone: profile.contactPhone || "",
        website: profile.website || "",
        capacityMeals: profile.capacityMeals || "",
        operatingHours: profile.operatingHours || "",
        focusArea: profile.focusArea || "",
        dietaryPref: profile.dietaryPref || ["Vegetarian"],
        acceptedFoodTypes: profile.acceptedFoodTypes || ["Cooked Food", "Raw Ingredients", "Packaged Food"],
      });
    }
  }, [profile]);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  function toggle(arr, val) {
    return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
  }

  const { mutate, isPending } = useUpdateNgoProfile({
    onSuccess: () => navigate("/dashboard"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ ...form, capacityMeals: Number(form.capacityMeals) });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center gap-3 text-gray-500">
        <Loader2 className="animate-spin" size={24} />
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-medium mb-6 transition-colors"
        >
          <ChevronLeft size={18} /> Back to Dashboard
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="bg-linear-to-r from-gray-900 to-gray-800 p-8 text-white flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
              <Building2 size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">Edit Profile</h1>
              <p className="text-gray-400 text-sm mt-1">Update your NGO's public information and capacity.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input label="Organisation Name" value={form.orgName || ""} onChange={(e) => set("orgName", e.target.value)} required />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea rows={3} value={form.description || ""} onChange={(e) => set("description", e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm resize-none" />
              </div>
              
              <Input label="Registration Number" value={form.registrationNo || ""} onChange={(e) => set("registrationNo", e.target.value)} />
              <Input label="Contact Phone" value={form.contactPhone || ""} onChange={(e) => set("contactPhone", e.target.value)} required />
              
              <div className="md:col-span-2">
                <Input label="Full Address" value={form.address || ""} onChange={(e) => set("address", e.target.value)} required />
              </div>
              <Input label="City" value={form.city || ""} onChange={(e) => set("city", e.target.value)} required />
              <Input label="State" value={form.state || ""} onChange={(e) => set("state", e.target.value)} />
              <Input label="Pincode" value={form.pincode || ""} onChange={(e) => set("pincode", e.target.value)} />
              <Input label="Website" value={form.website || ""} onChange={(e) => set("website", e.target.value)} />

              <div className="md:col-span-2 border-t border-gray-100 pt-6 mt-2">
                <h3 className="font-bold text-gray-800 mb-4">Capacity & Preferences</h3>
              </div>
              
              <Input label="Daily Capacity (Meals)" type="number" value={form.capacityMeals || ""} onChange={(e) => set("capacityMeals", e.target.value)} required />
              <Input label="Operating Hours" value={form.operatingHours || ""} onChange={(e) => set("operatingHours", e.target.value)} />
              <div className="md:col-span-2">
                <Input label="Focus Area (e.g., Children, Elderly, All)" value={form.focusArea || ""} onChange={(e) => set("focusArea", e.target.value)} />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 block mb-2">Dietary Preference *</label>
                <div className="flex gap-2 flex-wrap">
                  {["Vegetarian", "Non-Vegetarian", "Vegan"].map((d) => (
                    <button key={d} type="button"
                      onClick={() => set("dietaryPref", toggle(form.dietaryPref || [], d))}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                        (form.dietaryPref || []).includes(d)
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                      }`}
                    >{d}</button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 block mb-2">Accepted Food Types</label>
                <div className="flex gap-2 flex-wrap">
                  {["Cooked Food", "Raw Ingredients", "Packaged Food"].map((t) => (
                    <button key={t} type="button"
                      onClick={() => set("acceptedFoodTypes", toggle(form.acceptedFoodTypes || [], t))}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                        (form.acceptedFoodTypes || []).includes(t)
                          ? "bg-gray-800 text-white border-gray-800"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                      }`}
                    >{t}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-100 mt-8">
              <button
                type="submit"
                disabled={isPending}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-orange-500/20"
              >
                {isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

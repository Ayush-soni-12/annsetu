import { useState } from "react";
import { motion } from "framer-motion";


export default function DonateFood() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    foodType: "",
    quantity: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Food Donation:", form);
  };

  return (
    <section className="min-h-screen bg-orange-50 px-6 md:px-16 py-12">

      {/* HERO */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-gray-800">
          Share Food.{" "}
          <span className="text-orange-500">Spread Happiness.</span>
        </h1>

        <p className="text-gray-600 mt-4">
          Your extra food can feed someone in need. Let’s reduce hunger together.
        </p>
      </div>

      {/* FORM */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white max-w-3xl mx-auto rounded-2xl shadow-xl p-8 space-y-5"
      >
        <h2 className="text-xl font-semibold text-gray-700">
          Donate Food Details
        </h2>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
          required
        />

        {/* Phone */}
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
          required
        />

        {/* Food Type */}
        <select
          name="foodType"
          value={form.foodType}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
          required
        >
          <option value="">Select Food Type</option>
          <option>Cooked Food</option>
          <option>Packaged Food</option>
          <option>Raw Food</option>
        </select>

        {/* Quantity */}
        <input
          type="text"
          name="quantity"
          placeholder="Quantity (e.g. 10 meals)"
          value={form.quantity}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
          required
        />

        {/* Address */}
        <textarea
          name="address"
          placeholder="Pickup Address"
          value={form.address}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
          rows="3"
          required
        />

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-linear-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold"
        >
          Donate Food 🍱
        </motion.button>
      </motion.form>

      {/* HOW IT WORKS */}
      <div className="max-w-4xl mx-auto mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          How it works
        </h2>

        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div className="bg-white p-5 rounded-xl shadow">
            📦 Submit food details
          </div>
          <div className="bg-white p-5 rounded-xl shadow">
            🚚 Our team collects it
          </div>
          <div className="bg-white p-5 rounded-xl shadow">
            ❤️ Food reaches people in need
          </div>
        </div>
      </div>

      {/* TRUST */}
      <div className="text-center mt-12 text-gray-500 text-sm">
        ✔ Safe Handling • ✔ Verified NGOs • ✔ Zero Food Waste
      </div>

    </section>
  );
}
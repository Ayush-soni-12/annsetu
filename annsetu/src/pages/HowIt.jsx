import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

export default function HowItWorks() {
  const steps = [
    {
      title: "Donate Food",
      desc: "Share your extra food with us by filling a simple form.",
      icon: "🍱",
    },
    {
      title: "We Collect",
      desc: "Our team picks up the food from your location safely.",
      icon: "📦",
    },
    {
      title: "We Distribute",
      desc: "Food is delivered to NGOs and people in need.",
      icon: "🚚",
    },
    {
      title: "Impact Created",
      desc: "Your food brings smiles and reduces hunger.",
      icon: "❤️",
    },
  ];

  return (
    <section className="min-h-screen bg-white px-6 md:px-16 py-16">

      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-gray-800">
          How <span className="text-orange-500">Annsetu</span> Works
        </h1>

        <p className="text-gray-500 mt-4">
          A simple process to turn your extra food into someone’s meal.
        </p>
      </div>

      {/* Steps */}
      <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">

        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-orange-50 rounded-2xl p-6 text-center shadow hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">{step.icon}</div>

            <h3 className="font-semibold text-lg text-gray-800">
              {step.title}
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <NavLink to="/signup">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-linear-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold"
        >
          Donate now 🍱
        </motion.button>
        </NavLink>
      </div>

    </section>
  );
}
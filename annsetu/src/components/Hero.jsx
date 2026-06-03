import impact from "../assets/impact.png";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="w-full min-h-[90vh] bg-linear-to-br from-orange-50 to-red-50 flex items-center px-6 md:px-16">
      
      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-10 items-center">
        
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-800">
            Here’s to you, who helps feed a{" "}
            <span className="text-orange-500">nation!</span>
          </h1>

          <p className="mt-4 text-gray-600 text-lg">
            See how many meals you helped deliver with Annsetu
          </p>

          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            
            <NavLink to="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-linear-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md"
              >
              Donate Now 🍱
            </motion.button>
              </NavLink>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-white px-6 py-3 rounded-xl font-semibold shadow-md"
            >
              Track Impact →
            </motion.button>

          </div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative flex justify-center"
        >
          {/* Replace this image */}
          <img
            src={impact}
            alt="Annsetu Impact"
            className="w-full max-w-md rounded-2xl shadow-lg"
          />

          {/* Floating card */}
          <div className="absolute -bottom-6 bg-white shadow-lg rounded-xl px-5 py-3">
            <p className="text-sm text-gray-500">Meals served</p>
            <h3 className="text-xl font-bold text-orange-500">
              124+ 🍱
            </h3>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
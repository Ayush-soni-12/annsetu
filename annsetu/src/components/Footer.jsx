
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";



export default function Footer() {
  return (
    <footer className="bg-[#0B1A2B] text-gray-300 pt-16 pb-6 px-6 md:px-16">

      {/* Top Section */}
      <div className="grid md:grid-cols-4 gap-10 max-w-7xl mx-auto">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            Ann<span className="text-red-500">❤</span>setu
          </h2>

          <p className="mt-4 text-sm leading-relaxed">
            Connecting surplus food with people in need. Together, we aim to build a hunger-free India.
          </p>

          {/* Social */}
          <div className="flex gap-4 mt-5">
            {["🌐", "📸", "🐦", "💼"].map((icon, i) => (
              <motion.span
                key={i}
                whileHover={{ scale: 1.2, y: -3 }}
                className="bg-white/10 p-2 rounded-full cursor-pointer"
              >
                {icon}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-orange-400 cursor-pointer transition">
              <NavLink to="/contact">Contact</NavLink>
            </li>
            {["Home", "Services", "Donate"].map((item) => (
              <li key={item} className="hover:text-orange-400 cursor-pointer transition">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-white font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-orange-400 cursor-pointer transition">
              <NavLink to="/about">About Us</NavLink>
            </li>
            {["Impact", "FAQs", "Privacy Policy"].map((item) => (
              <li key={item} className="hover:text-orange-400 cursor-pointer transition">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
          <p className="text-sm mb-4">
            Get updates about our work and impact stories.
          </p>

          <div className="flex bg-white/10 rounded-full overflow-hidden">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent px-4 py-2 w-full outline-none text-sm"
            />
            <button className="bg-linear-to-r from-orange-500 to-red-500 px-5 text-white text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm text-gray-400">
        © 2026 Annsetu. Made with ❤️ for a hunger-free India.
      </div>
    </footer>
  );
}
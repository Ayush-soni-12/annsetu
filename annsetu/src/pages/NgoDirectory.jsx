import { useState } from "react";
import { useAllNgos } from "../hooks/useNgos";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Phone, Globe, Users, Utensils,
  Clock, Search, Loader2, Building2, ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FOOD_TYPE_COLORS = {
  Vegetarian:     "bg-green-100 text-green-700",
  "Non-Vegetarian": "bg-red-100 text-red-700",
  Vegan:          "bg-emerald-100 text-emerald-700",
};

const CITIES = ["All", "Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata"];

export default function NgoDirectory() {
  const { isAuthenticated } = useAuth();
  const [cityFilter, setCityFilter] = useState("");
  const [search, setSearch] = useState("");

  const { data: ngos = [], isLoading, isError } = useAllNgos(cityFilter);

  // Client-side search filter on top of city filter
  const filtered = ngos.filter((n) =>
    search.trim() === "" ||
    n.orgName.toLowerCase().includes(search.toLowerCase()) ||
    n.city.toLowerCase().includes(search.toLowerCase()) ||
    n.focusArea?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#faf8f5]">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-linear-to-br from-orange-500 to-red-500 text-white py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Building2 size={16} />
            Verified NGO Partners
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            NGO Directory
          </h1>
          <p className="text-orange-100 text-lg max-w-xl mx-auto">
            Browse our verified NGO partners. You can donate to any of them directly — or let us find the best match for your food.
          </p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* ── Filters ──────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, city, or focus area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            />
          </div>

          {/* City filter */}
          <div className="flex gap-2 flex-wrap">
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => setCityFilter(city === "All" ? "" : city)}
                className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                  (cityFilter === "" && city === "All") || cityFilter === city
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* ── Loading ───────────────────────────────────────────── */}
        {isLoading && (
          <div className="flex items-center justify-center py-24 text-gray-400 gap-3">
            <Loader2 className="animate-spin" size={28} />
            <span>Loading NGOs...</span>
          </div>
        )}

        {/* ── Error ─────────────────────────────────────────────── */}
        {isError && (
          <div className="text-center py-16 text-red-500">
            ❌ Could not load NGOs. Please check your connection and try again.
          </div>
        )}

        {/* ── Empty State ───────────────────────────────────────── */}
        {!isLoading && !isError && filtered.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <Building2 size={52} className="mx-auto mb-4 text-gray-200" />
            <p className="text-lg font-medium text-gray-500">No NGOs found</p>
            <p className="text-sm mt-1">Try a different city or search term.</p>
          </div>
        )}

        {/* ── NGO Grid ─────────────────────────────────────────── */}
        {!isLoading && !isError && filtered.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-6">
              Showing <span className="font-semibold text-gray-800">{filtered.length}</span> NGO{filtered.length !== 1 ? "s" : ""}
              {cityFilter ? ` in ${cityFilter}` : ""}
            </p>

            <motion.div
              layout
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 relative"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((ngo, i) => (
                  <motion.div
                    key={ngo._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <NgoCard ngo={ngo} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}

        {/* ── Register Your NGO CTA ────────────────────────────── */}
        {!isAuthenticated && (
          <div className="mt-20 bg-linear-to-r from-orange-50 to-red-50 border border-orange-100 rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Are you an NGO? 🏢
            </h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Register your organisation on Annsetu to start receiving food donations from donors in your city.
            </p>
            <Link
              to="/signup/ngo"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-semibold transition-colors"
            >
              Register as NGO →
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

// ── NGO Card ─────────────────────────────────────────────────
function NgoCard({ ngo }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full">

      {/* Top colour bar */}
      <div className="h-2 bg-linear-to-r from-orange-400 to-red-400" />

      <div className="p-6 flex flex-col flex-1">

        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0 overflow-hidden">
            {ngo.logoUrl ? (
              <img src={ngo.logoUrl} alt={ngo.orgName} className="w-full h-full object-cover" />
            ) : (
              <Building2 size={24} className="text-orange-400" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-extrabold text-gray-900 text-lg leading-tight line-clamp-2">
              {ngo.orgName}
            </h3>
            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
              <MapPin size={13} />
              <span>{ngo.city}{ngo.state ? `, ${ngo.state}` : ""}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {ngo.description && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
            {ngo.description}
          </p>
        )}

        {/* Dietary tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {ngo.dietaryPref?.map((pref) => (
            <span
              key={pref}
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                FOOD_TYPE_COLORS[pref] ?? "bg-gray-100 text-gray-600"
              }`}
            >
              {pref}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <StatChip icon={<Utensils size={14} />} value={`${ngo.capacityMeals}/day`} label="Capacity" />
          <StatChip icon={<Users size={14} />}    value={ngo.focusArea || "All"}    label="Serves"   />
          <StatChip icon={<Clock size={14} />}    value={ngo.operatingHours || "—"} label="Hours"    />
        </div>

        {/* Impact badge */}
        {ngo.totalMealsReceived > 0 && (
          <div className="bg-orange-50 rounded-2xl px-4 py-2.5 text-center mb-4">
            <span className="text-orange-600 font-bold text-lg">{ngo.totalMealsReceived.toLocaleString()}</span>
            <span className="text-orange-400 text-xs ml-1">meals received</span>
          </div>
        )}

        {/* Contact + Action */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex gap-3">
            {ngo.contactPhone && (
              <a
                href={`tel:${ngo.contactPhone}`}
                className="text-gray-400 hover:text-orange-500 transition-colors"
                title="Call"
              >
                <Phone size={18} />
              </a>
            )}
            {ngo.website && (
              <a
                href={ngo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-500 transition-colors"
                title="Website"
              >
                <Globe size={18} />
              </a>
            )}
          </div>
          <Link
            to={`/ngos/${ngo._id}`}
            className="flex items-center gap-1 text-orange-500 hover:text-orange-600 text-sm font-semibold transition-colors"
          >
            View Profile <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatChip({ icon, value, label }) {
  return (
    <div className="bg-gray-50 rounded-xl p-2.5 text-center">
      <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">{icon}</div>
      <p className="text-xs font-bold text-gray-800 truncate">{value}</p>
      <p className="text-[10px] text-gray-400">{label}</p>
    </div>
  );
}

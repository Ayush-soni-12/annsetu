import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyDonations } from "../services/api";
import DashboardSidebar from "../components/DashboardSidebar";
import { useAuth } from "../context/AuthContext";
import { Clock, CheckCircle, Truck, Package, XCircle, Loader2, UtensilsCrossed, Filter, ChevronRight, Calendar, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Status config ────────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    dot: "bg-yellow-400",
  },
  ASSIGNED: {
    label: "Assigned",
    icon: Package,
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-400",
  },
  PICKED_UP: {
    label: "Picked Up",
    icon: Truck,
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-400",
  },
  DELIVERED: {
    label: "Delivered",
    icon: CheckCircle,
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-500",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-400",
  },
};

export default function History() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("ALL"); // ALL, ACTIVE, PAST

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["myDonations"],
    queryFn: () => getMyDonations().then((res) => res.data),
  });

  const donations = data?.donations || [];

  // Summary stats derived from the list
  const totalMeals = donations.reduce((sum, d) => sum + (d.serves || 0), 0);
  const delivered = donations.filter((d) => d.status === "DELIVERED").length;
  const active = donations.filter((d) => ["PENDING", "ASSIGNED", "PICKED_UP"].includes(d.status)).length;

  // Filter logic
  const filteredDonations = donations.filter((d) => {
    if (filter === "ACTIVE") return ["PENDING", "ASSIGNED", "PICKED_UP"].includes(d.status);
    if (filter === "PAST") return ["DELIVERED", "CANCELLED"].includes(d.status);
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <DashboardSidebar />

      <main className="flex-1 ml-0 lg:ml-72 min-h-screen overflow-y-auto p-6 md:p-8">
        <div className="w-full max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-8 bg-white p-8 rounded-3xl shadow-sm border border-orange-100/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Impact Journey</h1>
            <p className="text-gray-500 mt-2 text-base">
              Hello <span className="font-bold text-orange-600">{user?.name}</span>, here is a record of every time you've made the world a better place 🍱
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            <SummaryCard icon="🍱" label="Total Donations" value={donations.length} color="orange" />
            <SummaryCard icon="👥" label="Total Meals Shared" value={`${totalMeals}+`} color="green" />
            <SummaryCard icon="🔥" label="Active Donations" value={active} color="blue" />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mb-6 bg-white p-2 rounded-2xl w-max shadow-sm border border-gray-100">
            <FilterTab active={filter === "ALL"} onClick={() => setFilter("ALL")} label="All History" count={donations.length} />
            <FilterTab active={filter === "ACTIVE"} onClick={() => setFilter("ACTIVE")} label="Active" count={active} />
            <FilterTab active={filter === "PAST"} onClick={() => setFilter("PAST")} label="Past" count={donations.length - active} />
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Loader2 className="animate-spin mb-3" size={32} />
              <p className="text-sm">Loading your donations...</p>
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-4">
              ❌ &nbsp;{error?.response?.data?.message || "Failed to load history. Please try again."}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && donations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <UtensilsCrossed size={48} className="mb-4 text-gray-300" />
              <p className="text-base font-medium text-gray-500">No donations yet</p>
              <p className="text-sm mt-1">Your food donations will appear here once you submit one.</p>
            </div>
          )}

          {/* Donation List */}
          {!isLoading && !isError && filteredDonations.length > 0 && (
            <motion.div 
              layout
              className="space-y-5"
            >
              <AnimatePresence mode="popLayout">
                {filteredDonations.map((donation, index) => (
                  <motion.div
                    key={donation._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <DonationCard donation={donation} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}

// ─── Donation Card ────────────────────────────────────────────
function DonationCard({ donation }) {
  const status = STATUS_CONFIG[donation.status] || STATUS_CONFIG.PENDING;
  const StatusIcon = status.icon;

  const createdAt = new Date(donation.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  });

  const pickupAt = donation.pickupTime
    ? new Date(donation.pickupTime).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric"
      })
    : "—";

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="flex flex-col sm:flex-row">
        
        {/* Image Section */}
        <div className="w-full sm:w-48 h-48 sm:h-auto bg-gray-50 relative overflow-hidden shrink-0">
          {donation.foodImageUrl ? (
            <img
              src={donation.foodImageUrl}
              alt={donation.foodName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100/50 text-orange-300">
              <UtensilsCrossed size={40} />
            </div>
          )}
          {/* Floating Status Badge */}
          <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-sm shadow-sm ${status.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
            {status.label}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-extrabold text-gray-900 text-xl truncate pr-4">{donation.foodName}</h3>
              <span className="text-xs font-semibold text-gray-400 flex items-center shrink-0">
                <Calendar size={14} className="mr-1" /> {createdAt}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-4">{donation.foodType} &nbsp;•&nbsp; {donation.foodCategory}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <StatBlock label="Quantity" value={donation.quantity} />
              <StatBlock label="Serves" value={`${donation.serves} people`} />
              <StatBlock label="Pickup Date" value={pickupAt} />
              <StatBlock label="Status" value={status.label} icon={<StatusIcon size={14} className="ml-1" />} colorClass={status.text} />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500 truncate pr-4">
              <MapPin size={14} className="mr-1.5 text-gray-400 shrink-0" />
              <span className="truncate">{donation.address}</span>
            </div>
            
            <button className="text-orange-500 hover:text-orange-600 font-semibold text-sm flex items-center shrink-0 transition-colors">
              Details <ChevronRight size={16} className="ml-0.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatBlock({ label, value, icon, colorClass = "text-gray-900" }) {
  return (
    <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
      <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">{label}</p>
      <div className={`text-sm font-bold flex items-center ${colorClass}`}>
        {value} {icon}
      </div>
    </div>
  );
}

// ─── Utility Components ───────────────────────────────────────
function SummaryCard({ icon, label, value, color }) {
  const colors = {
    orange: "from-orange-500 to-orange-600 shadow-orange-200",
    green: "from-emerald-500 to-emerald-600 shadow-emerald-200",
    blue: "from-blue-500 to-blue-600 shadow-blue-200",
  };

  return (
    <div className={`rounded-3xl bg-gradient-to-br ${colors[color]} text-white p-6 shadow-lg flex items-center gap-5 relative overflow-hidden`}>
      <div className="absolute -right-4 -top-4 text-white/10 text-8xl pointer-events-none">
        {icon}
      </div>
      <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md shrink-0">
        <span className="text-3xl">{icon}</span>
      </div>
      <div className="z-10">
        <p className="text-3xl font-extrabold tracking-tight">{value}</p>
        <p className="text-sm font-medium text-white/80 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function FilterTab({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 ${
        active 
          ? "bg-gray-900 text-white shadow-md" 
          : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      {label}
      <span className={`px-2 py-0.5 rounded-full text-[10px] ${active ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>
        {count}
      </span>
    </button>
  );
}

function MetaItem({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{label}</p>
      <p className="text-xs text-gray-700 font-medium mt-0.5 truncate">{value}</p>
    </div>
  );
}

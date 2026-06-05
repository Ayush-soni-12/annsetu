import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardSidebar from "../components/DashboardSidebar";
import NgoDashboard from "./NgoDashboard";
import { useMyStats, useMyDonations } from "../hooks/useDonations";
import {
  UtensilsCrossed,
  HeartHandshake,
  CheckCircle2,
  Plus,
  History,
  Loader2,
  Building2,
} from "lucide-react";

// ─── Status badge helper ───────────────────────────────────────
const STATUS_STYLES = {
  PENDING:   "bg-yellow-100 text-yellow-700",
  ASSIGNED:  "bg-blue-100   text-blue-700",
  PICKED_UP: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100  text-green-700",
  CANCELLED: "bg-red-100    text-red-700",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`text-xs font-semibold px-3 py-1 rounded-full ${
        STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

// ─── Skeleton card for loading state ──────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm animate-pulse">
      <div className="w-8 h-8 bg-gray-200 rounded-full mb-4" />
      <div className="w-16 h-8 bg-gray-200 rounded mb-2" />
      <div className="w-24 h-4 bg-gray-100 rounded" />
    </div>
  );
}

function DonorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: statsData, isLoading: statsLoading, isError: statsError } = useMyStats();
  const { data: donationsData, isLoading: donationsLoading } = useMyDonations();

  const stats = statsData ?? { totalDonations: 0, totalMeals: 0, deliveredCount: 0, co2Saved: 0 };
  const recentDonations = Array.isArray(donationsData) ? donationsData.slice(0, 3) : [];

  const statCards = [
    {
      icon: <UtensilsCrossed className="text-orange-500" size={24} />,
      value: stats.totalMeals,
      label: "Meals Donated",
      suffix: "",
    },
    {
      icon: <HeartHandshake className="text-red-500" size={24} />,
      value: stats.totalDonations,
      label: "Total Donations",
      suffix: "",
    },
    {
      icon: <CheckCircle2 className="text-green-500" size={24} />,
      value: stats.deliveredCount,
      label: "Deliveries Done",
      suffix: "",
    },
    {
      icon: <span className="text-2xl">🌱</span>,
      value: stats.co2Saved,
      label: "CO₂ Saved (kg)",
      suffix: "kg",
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] flex">

      {/* Fixed Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 ml-0 lg:ml-72 min-h-screen overflow-y-auto p-8">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome Back, {user?.name} 👋
          </h1>
          <p className="text-gray-500 mt-2">
            You're making a difference today.
          </p>
        </div>

        {/* Hero Banner */}
        <div className="bg-linear-to-r from-orange-500 to-red-500 rounded-3xl p-8 text-white flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold">Small Act, Big Impact ❤️</h2>
            <p className="mt-3 text-orange-100">
              Donate food, spread happiness and help build a better tomorrow.
            </p>
          </div>
          <button
            onClick={() => navigate("/donate")}
            className="bg-white text-orange-600 px-6 py-3 rounded-2xl font-semibold hover:bg-orange-50 transition-colors hidden sm:block"
          >
            Donate Now →
          </button>
        </div>

        {/* ── Stats Cards ─────────────────────────────────────────── */}
        {statsError ? (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
            Could not load stats. Make sure the backend server is running.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {statsLoading
              ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : statCards.map((card, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="mb-4">{card.icon}</div>
                    <h3 className="text-4xl font-bold text-gray-800">
                      {card.value}
                      <span className="text-lg font-medium text-gray-400 ml-1">
                        {card.suffix}
                      </span>
                    </h3>
                    <p className="text-gray-500 mt-1">{card.label}</p>
                  </div>
                ))}
          </div>
        )}

        {/* ── Bottom Section ──────────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Recent Donations */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recent Donations</h2>
              {recentDonations.length > 0 && (
                <button
                  onClick={() => navigate("/history")}
                  className="text-sm text-orange-500 hover:underline font-medium"
                >
                  View All →
                </button>
              )}
            </div>

            {donationsLoading ? (
              <div className="flex items-center justify-center py-12 text-gray-400 gap-2">
                <Loader2 className="animate-spin" size={20} />
                <span>Loading donations…</span>
              </div>
            ) : recentDonations.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-7xl mb-4">🍱</div>
                <h3 className="text-xl font-semibold text-gray-700">No Donations Yet</h3>
                <p className="text-gray-500 mt-2">Your donations will appear here.</p>
                <button
                  onClick={() => navigate("/donate")}
                  className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors"
                >
                  Make First Donation
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentDonations.map((d) => (
                  <div
                    key={d._id}
                    className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-orange-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Food image thumbnail */}
                      <img
                        src={d.foodImageUrl}
                        alt={d.foodName}
                        className="w-12 h-12 rounded-xl object-cover bg-gray-100"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{d.foodName}</p>
                        <p className="text-sm text-gray-500">
                          {d.serves} meals · {d.foodType}
                          {d.assignedNgo && (
                            <span className="ml-2 bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">
                              Direct
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={d.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Quick Actions</h2>
            <div className="space-y-4">
              <button
                onClick={() => navigate("/donate")}
                className="w-full bg-orange-500 text-white p-4 rounded-2xl flex items-center gap-3 hover:bg-orange-600 transition-colors font-medium"
              >
                <Plus size={20} />
                Donate Food
              </button>
              <button className="w-full border border-gray-200 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                View History
              </button>
              <button
                onClick={() => navigate("/ngos")}
                className="w-full border border-gray-200 p-4 rounded-2xl flex items-center gap-3 hover:bg-gray-50 transition-colors text-gray-700 font-medium"
              >
                <Building2 size={20} />
                Browse NGOs
              </button>
            </div>

            {/* Mini impact summary */}
            {!statsLoading && stats.totalMeals > 0 && (
              <div className="mt-8 p-4 bg-orange-50 rounded-2xl text-center">
                <p className="text-3xl font-bold text-orange-500">{stats.totalMeals}</p>
                <p className="text-sm text-gray-600 mt-1">
                  meals you've helped provide 🍱
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === "NGO") {
    return <NgoDashboard />;
  }
  
  return <DonorDashboard />;
}
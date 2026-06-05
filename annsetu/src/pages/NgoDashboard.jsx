import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardSidebar from "../components/DashboardSidebar";
import { useMyNgoProfile } from "../hooks/useNgos";
import { useNgoDonations } from "../hooks/useDonations";
import {
  Utensils,
  CheckCircle2,
  Settings,
  Package,
  Loader2,
  Building2
} from "lucide-react";

function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm animate-pulse">
      <div className="w-8 h-8 bg-gray-200 rounded-full mb-4" />
      <div className="w-16 h-8 bg-gray-200 rounded mb-2" />
      <div className="w-24 h-4 bg-gray-100 rounded" />
    </div>
  );
}

export default function NgoDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: profileData,
    isLoading: profileLoading,
    isError: profileError,
  } = useMyNgoProfile();

  const profile = profileData ?? { totalDonationsReceived: 0, totalMealsReceived: 0, capacityMeals: 50 };

  const { data: donations = [], isLoading: donationsLoading } = useNgoDonations();

  const pendingPickups = donations.filter((d) => d.status === "ASSIGNED").length;

  const statCards = [
    {
      icon: <Utensils className="text-orange-500" size={24} />,
      value: profile.totalMealsReceived,
      label: "Total Meals Received",
      suffix: "",
    },
    {
      icon: <CheckCircle2 className="text-green-500" size={24} />,
      value: profile.totalDonationsReceived,
      label: "Donations Completed",
      suffix: "",
    },
    {
      icon: <Package className="text-blue-500" size={24} />,
      value: pendingPickups,
      label: "Pending Pickups",
      suffix: "",
    },
    {
      icon: <Building2 className="text-purple-500" size={24} />,
      value: profile.capacityMeals,
      label: "Daily Capacity",
      suffix: "meals",
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
            Welcome, {profileData?.orgName || user?.name} 🏢
          </h1>
          <p className="text-gray-500 mt-2">
            Here is an overview of your organisation's impact.
          </p>
        </div>

        {/* Hero Banner for NGO */}
        <div className="bg-linear-to-r from-orange-500 to-red-500 rounded-3xl p-8 text-white flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Ready to receive donations?</h2>
            <p className="text-orange-100 max-w-lg">
              Keep your profile updated so donors and our AI matching system know exactly what food you need and when you can accept it.
            </p>
          </div>
          {!profileData?.verified && (
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-semibold border border-white/40 hidden sm:block">
              ⚠️ Profile Under Review
            </div>
          )}
        </div>

        {/* ── Stats Cards ─────────────────────────────────────────── */}
        {profileError ? (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
            Could not load profile. Make sure the backend server is running.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {profileLoading
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
          
          {/* Incoming Donations Board */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Incoming Donations</h2>
            </div>
            
            {donationsLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-orange-500" size={32} /></div>
            ) : donations?.length > 0 ? (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {donations.map((d) => (
                  <div key={d._id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-orange-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <img src={d.foodImageUrl} alt={d.foodName} className="w-12 h-12 rounded-xl object-cover bg-gray-100" />
                      <div>
                        <p className="font-semibold text-gray-800">{d.foodName} <span className="text-xs text-gray-400 font-normal">from {d.donorName}</span></p>
                        <p className="text-sm text-gray-500">{d.serves} meals · {d.foodType}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border
                      ${d.status === 'ASSIGNED' ? 'bg-orange-100 text-orange-600 border-orange-200' 
                        : d.status === 'DELIVERED' ? 'bg-green-100 text-green-600 border-green-200' 
                        : 'bg-gray-100 text-gray-600 border-gray-200'}
                    `}>
                      {d.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-7xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-700">No Pending Deliveries</h3>
                <p className="text-gray-500 mt-2">When food is assigned to your NGO, it will appear here.</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Quick Actions</h2>
            <div className="space-y-4">
              <button
                onClick={() => navigate("/ngos/edit")}
                className="w-full bg-gray-900 text-white p-4 rounded-2xl flex items-center gap-3 hover:bg-gray-800 transition-colors font-medium"
              >
                <Settings size={20} />
                Edit Profile
              </button>
              <button
                onClick={() => navigate("/history")}
                className="w-full border border-gray-200 p-4 rounded-2xl flex items-center gap-3 hover:bg-gray-50 transition-colors text-gray-700 font-medium"
              >
                <Package size={20} />
                Donation History
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

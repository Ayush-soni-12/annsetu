import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardSidebar from "../components/DashboardSidebar";
import {
  UtensilsCrossed,
  HeartHandshake,
  MapPin,
  Plus,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#faf8f5] flex">

      {/* Fixed Sidebar */}
      <DashboardSidebar />

      {/* Main Content — offset by sidebar width, independently scrollable */}
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
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 text-white flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold">
              Small Act, Big Impact ❤️
            </h2>
            <p className="mt-3 text-orange-100">
              Donate food, spread happiness and help build a better tomorrow.
            </p>
          </div>

          <button
            onClick={() => navigate("/donate")}
            className="bg-white text-orange-600 px-6 py-3 rounded-2xl font-semibold hover:bg-orange-50 transition-colors"
          >
            Donate Now →
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <UtensilsCrossed className="text-orange-500 mb-4" />
            <h3 className="text-4xl font-bold">0</h3>
            <p className="text-gray-500">Meals Donated</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <HeartHandshake className="text-red-500 mb-4" />
            <h3 className="text-4xl font-bold">0</h3>
            <p className="text-gray-500">NGOs Helped</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <MapPin className="text-yellow-500 mb-4" />
            <h3 className="text-4xl font-bold">0</h3>
            <p className="text-gray-500">Pickups Done</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <span className="text-green-500 text-2xl">🌱</span>
            <h3 className="text-4xl font-bold mt-4">0</h3>
            <p className="text-gray-500">CO₂ Saved</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Recent Donations */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Donations</h2>
            </div>

            <div className="text-center py-16">
              <div className="text-7xl mb-4">🍱</div>
              <h3 className="text-xl font-semibold">No Donations Yet</h3>
              <p className="text-gray-500 mt-2">Your donations will appear here.</p>
              <button
                onClick={() => navigate("/donate")}
                className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors"
              >
                Make First Donation
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <button
                onClick={() => navigate("/donate")}
                className="w-full bg-orange-500 text-white p-4 rounded-2xl flex items-center gap-3 hover:bg-orange-600 transition-colors"
              >
                <Plus />
                Donate Food
              </button>
              <button
                onClick={() => navigate("/history")}
                className="w-full border border-gray-200 p-4 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                View History
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
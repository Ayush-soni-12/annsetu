
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Utensils, HeartHandshake, MapPin, LogOut, PlusCircle, Clock } from "lucide-react";

const statCards = [
  { label: "Meals Donated", value: "0", icon: Utensils, color: "bg-orange-100 text-orange-600" },
  { label: "NGOs Helped", value: "0", icon: HeartHandshake, color: "bg-red-100 text-red-600" },
  { label: "Pickups Done", value: "0", icon: MapPin, color: "bg-yellow-100 text-yellow-600" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#fdf8f2]">

      {/* Top bar */}
      <div className="bg-white border-b px-6 md:px-16 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            👋 Welcome back, <span className="text-orange-500">{user?.name}</span>
          </h1>
          <p className="text-sm text-gray-400">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-16 py-10">

        {/* Stats */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10"
        >
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                variants={item}
                className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-5 border border-gray-100"
              >
                <div className={`p-3 rounded-xl ${card.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                  <p className="text-sm text-gray-500">{card.label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-10"
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/donate")}
              className="flex items-center gap-2 bg-linear-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md"
            >
              <PlusCircle size={18} />
              Donate Food
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold shadow-sm"
            >
              <Clock size={18} />
              View History
            </motion.button>
          </div>
        </motion.div>

        {/* Recent Donations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-6">Recent Donations</h2>

          {/* Empty state */}
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">🍱</div>
            <p className="text-gray-500 font-medium">No donations yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-6">
              Your first donation will appear here. Start making a difference today!
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/donate")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-semibold transition text-sm"
            >
              Make your first donation →
            </motion.button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

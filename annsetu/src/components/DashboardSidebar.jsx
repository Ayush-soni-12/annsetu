import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.jpeg";
import {
  LayoutDashboard,
  UtensilsCrossed,
  History,
  User,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Donate Food", icon: UtensilsCrossed, path: "/donate" },
  { label: "History", icon: History, path: "/history" },
  { label: "Profile", icon: User, path: "/profile" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-6 right-6 z-40 p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-all"
      >
        <Menu size={24} />
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-screen w-72 bg-white border-r border-gray-100 shadow-sm flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Top: Logo + Nav */}
        <div className="overflow-y-auto">
          {/* Mobile Close Button */}
          <button 
            onClick={closeSidebar}
            className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full"
          >
            <X size={20} />
          </button>

          {/* Logo */}
          <div className="p-8 flex flex-col items-center border-b border-gray-50 mt-4 lg:mt-0">
            <img
              src={logo}
              alt="AnnSetu"
              className="w-28 h-28 object-contain"
            />
            <h1 className="text-3xl font-bold text-orange-600 mt-2">
              AnnSetu
            </h1>
            <p className="text-xs text-gray-400 text-center mt-1">
              Food for all, kindness for life
            </p>
          </div>

          {/* Nav Links */}
          <nav className="px-4 py-6 space-y-2">
            {navItems.map(({ label, icon: Icon, path }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => {
                    navigate(path);
                    closeSidebar();
                  }}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                      : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  <Icon size={20} className={isActive ? "text-white" : "text-gray-400"} />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full bg-linear-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

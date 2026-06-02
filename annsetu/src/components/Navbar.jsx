import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white border-b-2 bg-linear-to-br from-orange-50 to-red-50 shadow-md px-6 md:px-10 py-4 flex items-center justify-between relative">

        {/* LEFT - LOGO + NAME */}
        <NavLink to="/" className="flex items-center gap-3">
          <img src={logo} alt="logo" className="w-10 h-10 object-contain" />
          <div className="flex flex-col leading-tight">
            <h1 className="text-2xl font-bold tracking-wide">
              <span className="text-[#FF9933]">ann</span>
              <span className="text-[#8B0000]">setu</span>
            </h1>
            <p className="text-[12px] text-[#D4AF37] tracking-wide">अन्न दान महा दान</p>
          </div>
        </NavLink>

        {/* CENTER - LINKS (DESKTOP) */}
        <div className="hidden md:flex gap-8 text-[#8B0000] font-medium">
          <NavLink to="/how-it-works" className="relative group cursor-pointer">
            How It Works
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#FF9933] transition-all duration-300 group-hover:w-full" />
          </NavLink>
          <NavLink to="/about" className="relative group cursor-pointer">
            About
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#FF9933] transition-all duration-300 group-hover:w-full" />
          </NavLink>
          {["NGOs", "Impact"].map((item) => (
            <a key={item} href="#" className="relative group cursor-pointer">
              {item}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#FF9933] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* RIGHT — changes based on auth state */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            // Logged in: show name + dashboard link + logout
            <>
              <NavLink
                to="/dashboard"
                className="text-[#8B0000] font-medium hover:text-[#FF9933] transition"
              >
                👋 {user?.name?.split(" ")[0]}
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-500 transition border border-gray-200 px-4 py-2 rounded-full"
              >
                Logout
              </button>
            </>
          ) : (
            // Not logged in: show Login + Donate
            <>
              <NavLink to="/login">
                <button className="text-[#8B0000] font-medium hover:text-[#FF9933] transition">
                  Login
                </button>
              </NavLink>
              <NavLink to="/signup">
                <button className="bg-linear-to-r from-[#FF9933] to-[#D4AF37] text-white px-5 py-2 rounded-full shadow hover:scale-105 transition">
                  Donate now
                </button>
              </NavLink>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-[#8B0000] text-2xl">
            ☰
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#FFF5E1] shadow-md flex flex-col items-center py-6 gap-4 md:hidden z-50">
            <NavLink to="/how-it-works" className="text-[#8B0000] font-medium" onClick={() => setMenuOpen(false)}>
              How It Works
            </NavLink>
            <NavLink to="/about" className="text-[#8B0000] font-medium" onClick={() => setMenuOpen(false)}>
              About
            </NavLink>
            {["NGOs", "Impact"].map((item) => (
              <a key={item} href="#" className="text-[#8B0000] font-medium">
                {item}
              </a>
            ))}

            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className="text-[#8B0000] font-medium" onClick={() => setMenuOpen(false)}>
                  My Dashboard
                </NavLink>
                <button onClick={handleLogout} className="text-red-500 font-medium">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                  <button className="text-[#8B0000] font-medium">Login</button>
                </NavLink>
                <NavLink to="/signup" onClick={() => setMenuOpen(false)}>
                  <button className="bg-[#FF9933] text-white px-5 py-2 rounded-full">
                    Donate now
                  </button>
                </NavLink>
              </>
            )}
          </div>
        )}
      </nav>
      <Outlet />
    </>
  );
}

export default Navbar;
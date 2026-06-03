import React from 'react'

const Profile = () => {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex">

      {/* Sidebar */}
      <aside className="w-72 bg-white border-r shadow-sm hidden lg:flex flex-col justify-between">

        <div>
          <div className="p-8 flex flex-col items-center">
            <img
              src={logo}
              alt="AnnSetu"
              className="w-32 h-32 object-contain"
            />

            <h1 className="text-4xl font-bold text-orange-600 mt-2">
              AnnSetu
            </h1>

            <p className="text-sm text-gray-500 text-center mt-2">
              Food for all, kindness for life
            </p>
          </div>

          <nav className="px-4 mt-6 space-y-3">

            <button className="w-full flex items-center gap-3 bg-orange-500 text-white px-5 py-4 rounded-2xl">
              <LayoutDashboard size={20} />
              Dashboard
            </button>

            <button
              onClick={() => navigate("/donate")}
              className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl hover:bg-orange-50"
            >
              <UtensilsCrossed size={20} />
              Donate Food
            </button>

            <button className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl hover:bg-orange-50">
              <History size={20} />
              History
            </button>

            <button className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl hover:bg-orange-50">
              <User size={20} />
              Profile
            </button>

            <button className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl hover:bg-orange-50">
              <Settings size={20} />
              Settings
            </button>
          </nav>
        </div>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-2xl flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
      </div>
  )
}

export default Profile
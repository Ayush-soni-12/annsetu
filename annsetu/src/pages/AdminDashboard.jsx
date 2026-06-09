import React, { useState, useEffect } from "react";
import { Users, Building2, Package, CheckCircle, Clock, ShieldCheck, TrendingUp, AlertCircle, Search, MoreVertical, MapPin, Trash2 } from "lucide-react";
import { 
  getAdminUsers, getAdminNgos, getAdminDonations, 
  approveAdminNgo, updateAdminDonationStatus,
  deleteAdminUser, deleteAdminNgo, deleteAdminDonation
} from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [usersRes, ngosRes, donationsRes] = await Promise.all([
        getAdminUsers(),
        getAdminNgos(),
        getAdminDonations()
      ]);
      
      if (usersRes.data.success) setUsers(usersRes.data.users);
      if (ngosRes.data.success) setNgos(ngosRes.data.ngos);
      if (donationsRes.data.success) setDonations(donationsRes.data.donations);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleApproveNgo = async (id) => {
    try {
      const { data } = await approveAdminNgo(id);
      if (data.success) {
        setNgos(ngos.map(ngo => ngo._id === id ? { ...ngo, verified: true } : ngo));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve NGO");
    }
  };

  const handleUpdateDonationStatus = async (id, status) => {
    try {
      const { data } = await updateAdminDonationStatus(id, { status });
      if (data.success) {
        setDonations(donations.map(d => d._id === id ? { ...d, status } : d));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update donation status");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      const { data } = await deleteAdminUser(id);
      if (data.success) {
        setUsers(users.filter(u => u._id !== id));
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleDeleteNgo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this NGO? This will also delete the associated user account.")) return;
    try {
      const { data } = await deleteAdminNgo(id);
      if (data.success) {
        setNgos(ngos.filter(n => n._id !== id));
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete NGO");
    }
  };

  const handleDeleteDonation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this donation record?")) return;
    try {
      const { data } = await deleteAdminDonation(id);
      if (data.success) {
        setDonations(donations.filter(d => d._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete donation");
    }
  };

  const totalUsers = users.length;
  const pendingNgos = ngos.filter(n => !n.verified).length;
  const activeDonations = donations.filter(d => d.status !== 'DELIVERED' && d.status !== 'CANCELLED').length;

  return (
    <div className="min-h-screen bg-[#faf8f5] flex font-sans selection:bg-orange-200">
      
      <aside className="w-72 bg-white border-r border-orange-100 hidden lg:flex flex-col fixed h-full z-20">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-linear-to-br from-orange-500 to-red-500 p-2.5 rounded-xl text-white shadow-orange-500/30 shadow-lg">
              <ShieldCheck size={26} />
            </div>
            <h2 className="text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-orange-600 to-red-600 tracking-tight">Annsetu<span className="text-gray-300 font-light">Admin</span></h2>
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Main Menu</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <SidebarButton active={activeTab === "users"} onClick={() => setActiveTab("users")} icon={<Users />} label="User Management" count={totalUsers} />
          <SidebarButton active={activeTab === "ngos"} onClick={() => setActiveTab("ngos")} icon={<Building2 />} label="NGO Directory" count={pendingNgos > 0 ? pendingNgos : null} isAlert={pendingNgos > 0} />
          <SidebarButton active={activeTab === "donations"} onClick={() => setActiveTab("donations")} icon={<Package />} label="Donation Tracker" count={activeDonations > 0 ? activeDonations : null} />
        </nav>
        
        <div className="p-6">
          <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100/50">
            <h4 className="font-bold text-gray-800 text-sm mb-1">System Status</h4>
            <div className="flex items-center gap-2 text-xs text-green-600 font-semibold">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              All systems operational
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-800 capitalize flex items-center gap-3">
            {activeTab === "users" && <Users className="text-orange-500" />}
            {activeTab === "ngos" && <Building2 className="text-orange-500" />}
            {activeTab === "donations" && <Package className="text-orange-500" />}
            {activeTab} Overview
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Quick search..." className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all w-64" />
            </div>
            <div className="h-10 w-10 bg-linear-to-tr from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-md cursor-pointer hover:scale-105 transition-transform">
              AD
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full flex-1">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Platform Users" value={totalUsers} icon={<Users size={24} className="text-blue-500"/>} trend="Registered" />
            <StatCard title="Pending Approvals" value={pendingNgos} icon={<AlertCircle size={24} className="text-orange-500"/>} trend="Requires attention" alert={pendingNgos > 0} />
            <StatCard title="Active Donations" value={activeDonations} icon={<TrendingUp size={24} className="text-green-500"/>} trend="Live tracking" />
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-8 flex items-center gap-3 text-red-700 shadow-sm">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {/* Main Data Container */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-800">Directory Database</h3>
              <button onClick={fetchData} className="text-sm font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-lg transition-colors">
                Refresh Data
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-96 flex-col gap-4">
                <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
                <p className="text-gray-400 font-medium text-sm animate-pulse">Syncing with database...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  
                  {/* --- USERS TABLE --- */}
                  {activeTab === "users" && (
                    <>
                      <thead className="bg-gray-50/80 text-xs uppercase text-gray-500 font-bold tracking-wider">
                        <tr>
                          <th className="px-8 py-4">User Details</th>
                          <th className="px-8 py-4">Role / Access</th>
                          <th className="px-8 py-4">Status</th>
                          <th className="px-8 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        <AnimatePresence>
                          {users.map(user => (
                            <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-linear-to-tr from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold uppercase border border-gray-200">
                                    {user.name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{user.name}</p>
                                    <p className="text-gray-500 text-xs">{user.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <RoleBadge role={user.role} />
                              </td>
                              <td className="px-8 py-5">
                                {user.isVerified ? (
                                  <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded-full w-max font-medium text-xs">
                                    <CheckCircle size={14} /> Verified
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-full w-max font-medium text-xs">
                                    <Clock size={14} /> Pending
                                  </div>
                                )}
                              </td>
                              <td className="px-8 py-5 text-right">
                                <button 
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                  title="Delete User"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </>
                  )}

                  {/* --- NGOS TABLE --- */}
                  {activeTab === "ngos" && (
                    <>
                      <thead className="bg-gray-50/80 text-xs uppercase text-gray-500 font-bold tracking-wider">
                        <tr>
                          <th className="px-8 py-4">Organization</th>
                          <th className="px-8 py-4">Location & Contact</th>
                          <th className="px-8 py-4">Status</th>
                          <th className="px-8 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        <AnimatePresence>
                          {ngos.map(ngo => (
                            <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={ngo._id} className={`hover:bg-gray-50/50 transition-colors ${!ngo.verified ? 'bg-orange-50/30' : ''}`}>
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center border border-orange-200 shrink-0">
                                    <Building2 size={20} />
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-900 text-base">{ngo.orgName}</p>
                                    <p className="text-gray-500 text-xs mt-0.5 max-w-[200px] truncate">Req ID: {ngo._id.substring(0,8)}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-2 text-gray-700 mb-1">
                                  <MapPin size={14} className="text-gray-400" /> {ngo.city}
                                </div>
                                <div className="text-xs text-gray-500 pl-5">{ngo.contactPhone}</div>
                              </td>
                              <td className="px-8 py-5">
                                {ngo.verified ? (
                                  <span className="px-3 py-1.5 inline-flex text-xs font-bold rounded-full bg-green-100 text-green-800 border border-green-200">
                                    Approved Active
                                  </span>
                                ) : (
                                  <span className="px-3 py-1.5 inline-flex items-center gap-1.5 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200 animate-pulse">
                                    <AlertCircle size={12} /> Needs Approval
                                  </span>
                                )}
                              </td>
                              <td className="px-8 py-5 text-right flex items-center justify-end gap-2">
                                {!ngo.verified && (
                                  <button
                                    onClick={() => handleApproveNgo(ngo._id)}
                                    className="text-white bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-5 py-2 rounded-lg transition-all shadow-md hover:shadow-lg font-semibold text-xs uppercase tracking-wide inline-flex items-center gap-2"
                                  >
                                    <CheckCircle size={16} /> Approve
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleDeleteNgo(ngo._id)}
                                  className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                  title="Delete NGO"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </>
                  )}

                  {/* --- DONATIONS TABLE --- */}
                  {activeTab === "donations" && (
                    <>
                      <thead className="bg-gray-50/80 text-xs uppercase text-gray-500 font-bold tracking-wider">
                        <tr>
                          <th className="px-8 py-4">Food Package</th>
                          <th className="px-8 py-4">Donor & Receiver</th>
                          <th className="px-8 py-4">Status Update</th>
                          <th className="px-8 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        <AnimatePresence>
                          {donations.map(d => (
                            <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={d._id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-8 py-5">
                                <div className="flex items-start gap-4">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                                    d.status === 'DELIVERED' ? 'bg-green-100 border-green-200 text-green-600' :
                                    d.status === 'ASSIGNED' ? 'bg-blue-100 border-blue-200 text-blue-600' :
                                    'bg-orange-100 border-orange-200 text-orange-600'
                                  }`}>
                                    <Package size={20} />
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-900">{d.foodName}</p>
                                    <p className="text-gray-500 text-xs font-medium mt-1">
                                      <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">Serves {d.serves}</span>
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="grid grid-cols-1 gap-1">
                                  <p className="text-gray-800 font-medium flex items-center gap-2">
                                    <span className="w-16 text-xs text-gray-400">Donor:</span> {d.donorName}
                                  </p>
                                  <p className="text-gray-800 font-medium flex items-center gap-2">
                                    <span className="w-16 text-xs text-gray-400">NGO:</span> {d.assignedNgo ? d.assignedNgo.orgName : <span className="text-orange-500 italic">Finding Match...</span>}
                                  </p>
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                  <StatusBadge status={d.status} />
                                  
                                  {d.status !== 'DELIVERED' && d.status !== 'CANCELLED' && (
                                    <div className="relative">
                                      <select
                                        className="appearance-none bg-white border border-gray-200 text-gray-700 text-xs font-bold py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm cursor-pointer hover:border-orange-300 transition-colors"
                                        onChange={(e) => {
                                          if (e.target.value) handleUpdateDonationStatus(d._id, e.target.value);
                                        }}
                                        value=""
                                      >
                                        <option value="" disabled>Update Status...</option>
                                        <option value="ASSIGNED">Mark Assigned</option>
                                        <option value="PICKED_UP">Mark Picked Up</option>
                                        <option value="DELIVERED">Mark Delivered</option>
                                      </select>
                                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-8 py-5 text-right">
                                <button 
                                  onClick={() => handleDeleteDonation(d._id)}
                                  className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                  title="Delete Donation"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </>
                  )}
                  
                </table>

                {/* Empty States */}
                {activeTab === "users" && users.length === 0 && <EmptyState text="No users found in the system." />}
                {activeTab === "ngos" && ngos.length === 0 && <EmptyState text="No NGOs have registered yet." />}
                {activeTab === "donations" && donations.length === 0 && <EmptyState text="No donations have been made yet." />}

              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Helper Components ---

function SidebarButton({ active, onClick, icon, label, count, isAlert }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${
        active 
        ? "bg-orange-50 text-orange-600 shadow-[inset_0_0_0_1px_rgba(249,115,22,0.1)] font-bold" 
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800 font-medium"
      }`}
    >
      <div className="flex items-center gap-3">
        {React.cloneElement(icon, { size: 20, className: active ? "text-orange-500" : "text-gray-400" })}
        <span>{label}</span>
      </div>
      {count && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
          isAlert ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

function StatCard({ title, value, icon, trend, alert }) {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border ${alert ? 'border-orange-200 bg-orange-50/10' : 'border-gray-100'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${alert ? 'bg-orange-100' : 'bg-gray-50'}`}>
          {icon}
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${alert ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
          {trend}
        </span>
      </div>
      <div>
        <h3 className="text-gray-400 text-sm font-semibold mb-1">{title}</h3>
        <p className="text-3xl font-black text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function RoleBadge({ role }) {
  const styles = {
    ADMIN: "bg-gradient-to-r from-purple-100 to-fuchsia-100 text-purple-700 border-purple-200",
    NGO: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200",
    DONOR: "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200"
  };
  
  return (
    <span className={`px-3 py-1 text-[11px] font-black tracking-wider uppercase rounded-md border ${styles[role] || styles.DONOR}`}>
      {role}
    </span>
  );
}

function StatusBadge({ status }) {
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    ASSIGNED: "bg-blue-100 text-blue-700 border-blue-200",
    PICKED_UP: "bg-purple-100 text-purple-700 border-purple-200",
    DELIVERED: "bg-green-100 text-green-700 border-green-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200"
  };

  return (
    <span className={`px-3 py-1 text-[11px] font-black tracking-wider uppercase rounded-full border ${styles[status] || styles.PENDING}`}>
      {status}
    </span>
  );
}

function EmptyState({ text }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
        <Search className="text-gray-300" size={24} />
      </div>
      <h3 className="text-gray-800 font-bold mb-1">No Records Found</h3>
      <p className="text-gray-500 text-sm max-w-sm">{text}</p>
    </div>
  );
}

export default AdminDashboard;
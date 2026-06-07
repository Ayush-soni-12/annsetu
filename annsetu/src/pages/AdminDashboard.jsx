import React, { useState, useEffect } from "react";
import { Users, Building2, Package, CheckCircle, Clock } from "lucide-react";
import { getAdminUsers, getAdminNgos, getAdminDonations, approveAdminNgo, updateAdminDonationStatus } from "../services/api";

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
      if (activeTab === "users") {
        const { data } = await getAdminUsers();
        if (data.success) setUsers(data.users);
      } else if (activeTab === "ngos") {
        const { data } = await getAdminNgos();
        if (data.success) setNgos(data.ngos);
      } else if (activeTab === "donations") {
        const { data } = await getAdminDonations();
        if (data.success) setDonations(data.donations);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleApproveNgo = async (id) => {
    try {
      const { data } = await approveAdminNgo(id);
      if (data.success) {
        setNgos(ngos.map(ngo => ngo._id === id ? { ...ngo, verified: true } : ngo));
        alert("NGO Approved Successfully");
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
        alert(`Donation status updated to ${status}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update donation status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-orange-600">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center px-6 py-3 text-left ${activeTab === "users" ? "bg-orange-50 border-r-4 border-orange-600 text-orange-600 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
          >
            <Users className="mr-3 h-5 w-5" />
            Users
          </button>
          <button
            onClick={() => setActiveTab("ngos")}
            className={`w-full flex items-center px-6 py-3 text-left ${activeTab === "ngos" ? "bg-orange-50 border-r-4 border-orange-600 text-orange-600 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
          >
            <Building2 className="mr-3 h-5 w-5" />
            NGOs
          </button>
          <button
            onClick={() => setActiveTab("donations")}
            className={`w-full flex items-center px-6 py-3 text-left ${activeTab === "donations" ? "bg-orange-50 border-r-4 border-orange-600 text-orange-600 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
          >
            <Package className="mr-3 h-5 w-5" />
            Donations
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 capitalize">{activeTab}</h1>

        {error && <div className="bg-red-100 text-red-600 p-4 rounded mb-6">{error}</div>}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            {activeTab === "users" && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : user.role === 'NGO' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.isVerified ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Clock className="h-5 w-5 text-yellow-500" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "ngos" && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Org Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ngos.map(ngo => (
                    <tr key={ngo._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ngo.orgName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ngo.city}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ngo.contactPhone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ngo.verified ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approved</span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Under Review</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {!ngo.verified && (
                          <button
                            onClick={() => handleApproveNgo(ngo._id)}
                            className="text-white bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded-md transition-colors"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "donations" && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned NGO</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {donations.map(d => (
                    <tr key={d._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{d.foodName} <span className="text-gray-500 text-xs">({d.serves} serves)</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d.donorName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d.assignedNgo ? d.assignedNgo.orgName : "Unassigned"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${d.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 
                          d.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' : 
                          d.status === 'PICKED_UP' ? 'bg-purple-100 text-purple-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {d.status !== 'DELIVERED' && d.status !== 'CANCELLED' && (
                          <div className="flex gap-2">
                            <select
                              className="text-sm border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                              onChange={(e) => {
                                if (e.target.value) handleUpdateDonationStatus(d._id, e.target.value);
                              }}
                              defaultValue=""
                            >
                              <option value="" disabled>Update Status</option>
                              <option value="ASSIGNED">Assigned</option>
                              <option value="PICKED_UP">Picked Up</option>
                              <option value="DELIVERED">Delivered</option>
                            </select>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Empty States */}
            {activeTab === "users" && users.length === 0 && <div className="p-6 text-center text-gray-500">No users found.</div>}
            {activeTab === "ngos" && ngos.length === 0 && <div className="p-6 text-center text-gray-500">No NGOs found.</div>}
            {activeTab === "donations" && donations.length === 0 && <div className="p-6 text-center text-gray-500">No donations found.</div>}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import { useAuth } from "../context/AuthContext";
import { updateMe, changePassword, deleteAccount } from "../services/api";
import { 
  User, Mail, Lock, Bell, Trash2, Shield, Loader2, CheckCircle2, ChevronRight, AlertTriangle
} from "lucide-react";

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("account");

  // Account State
  const [accountForm, setAccountForm] = useState({ name: "", email: "" });
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountSuccess, setAccountSuccess] = useState(false);
  const [accountError, setAccountError] = useState("");

  // Security State
  const [securityForm, setSecurityForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState(false);
  const [securityError, setSecurityError] = useState("");

  // Notifications State
  const [preferences, setPreferences] = useState({ emailNotifications: true, pushNotifications: true });
  const [prefsLoading, setPrefsLoading] = useState(false);
  const [prefsSuccess, setPrefsSuccess] = useState(false);

  // Delete State
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (user) {
      setAccountForm({ name: user.name || "", email: user.email || "" });
      if (user.preferences) {
        setPreferences({
          emailNotifications: user.preferences.emailNotifications ?? true,
          pushNotifications: user.preferences.pushNotifications ?? true
        });
      }
    }
  }, [user]);

  // Handlers
  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setAccountLoading(true); setAccountError(""); setAccountSuccess(false);
    try {
      const { data } = await updateMe({ name: accountForm.name });
      if (data.success) {
        updateUser(data.user);
        setAccountSuccess(true);
        setTimeout(() => setAccountSuccess(false), 3000);
      }
    } catch (err) {
      setAccountError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setAccountLoading(false);
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      setSecurityError("New passwords do not match.");
      return;
    }
    setSecurityLoading(true); setSecurityError(""); setSecuritySuccess(false);
    try {
      const { data } = await changePassword({ 
        oldPassword: securityForm.oldPassword, 
        newPassword: securityForm.newPassword 
      });
      if (data.success) {
        setSecuritySuccess(true);
        setSecurityForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setSecuritySuccess(false), 3000);
      }
    } catch (err) {
      setSecurityError(err.response?.data?.message || "Failed to change password");
    } finally {
      setSecurityLoading(false);
    }
  };

  const togglePreference = async (key) => {
    const newValue = !preferences[key];
    const newPrefs = { ...preferences, [key]: newValue };
    setPreferences(newPrefs);
    setPrefsLoading(true); setPrefsSuccess(false);
    
    try {
      const { data } = await updateMe({ preferences: newPrefs });
      if (data.success) {
        updateUser(data.user);
        setPrefsSuccess(true);
        setTimeout(() => setPrefsSuccess(false), 2000);
      }
    } catch (err) {
      // Revert if failed
      setPreferences(preferences);
      alert("Failed to update preferences");
    } finally {
      setPrefsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== user.email) {
      setDeleteError("Email doesn't match");
      return;
    }
    setDeleteLoading(true); setDeleteError("");
    try {
      const { data } = await deleteAccount();
      if (data.success) {
        logout();
        navigate("/");
      }
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Failed to delete account");
      setDeleteLoading(false);
    }
  };

  // UI Components
  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all \${
        activeTab === id 
          ? "bg-orange-50 text-orange-600 border border-orange-200" 
          : "hover:bg-gray-50 text-gray-600 border border-transparent"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <span className="font-semibold">{label}</span>
      </div>
      <ChevronRight className={`w-4 h-4 ${activeTab === id ? "opacity-100" : "opacity-0"}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-[#faf8f5] flex">
      <DashboardSidebar />
      <main className="flex-1 ml-0 lg:ml-72 min-h-screen overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-500 mt-2">Manage your account preferences and security.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Left Sidebar Tabs */}
            <div className="col-span-1 space-y-2">
              <TabButton id="account" label="Account Details" icon={User} />
              <TabButton id="security" label="Security" icon={Shield} />
              <TabButton id="notifications" label="Notifications" icon={Bell} />
              <TabButton id="delete" label="Delete Account" icon={Trash2} />
            </div>

            {/* Right Content Area */}
            <div className="col-span-1 md:col-span-3">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[500px]">
                
                {/* ACCOUNT DETAILS TAB */}
                {activeTab === "account" && (
                  <div className="animate-in fade-in duration-300">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <User className="text-orange-500" /> Account Details
                    </h2>
                    {accountError && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm">{accountError}</div>}
                    
                    <form onSubmit={handleAccountSubmit} className="space-y-6 max-w-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={accountForm.name}
                            onChange={(e) => { setAccountForm({...accountForm, name: e.target.value}); setAccountSuccess(false); setAccountError(""); }}
                            className="pl-11 w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            value={accountForm.email}
                            className="pl-11 w-full p-3.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                            disabled
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Email cannot be changed once registered.</p>
                      </div>
                      <div className="pt-4 flex items-center gap-4">
                        <button
                          type="submit"
                          disabled={accountLoading || accountForm.name === user?.name}
                          className="bg-orange-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-orange-600 transition flex items-center gap-2 disabled:opacity-50"
                        >
                          {accountLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                          Save Changes
                        </button>
                        {accountSuccess && <span className="text-green-600 flex items-center gap-1 font-medium"><CheckCircle2 className="w-5 h-5"/> Saved</span>}
                      </div>
                    </form>
                  </div>
                )}

                {/* SECURITY TAB */}
                {activeTab === "security" && (
                  <div className="animate-in fade-in duration-300">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <Shield className="text-orange-500" /> Security
                    </h2>
                    {securityError && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm">{securityError}</div>}

                    <form onSubmit={handleSecuritySubmit} className="space-y-6 max-w-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="password"
                            value={securityForm.oldPassword}
                            onChange={(e) => { setSecurityForm({...securityForm, oldPassword: e.target.value}); setSecurityError(""); }}
                            className="pl-11 w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="password"
                            value={securityForm.newPassword}
                            onChange={(e) => { setSecurityForm({...securityForm, newPassword: e.target.value}); setSecurityError(""); }}
                            className="pl-11 w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="password"
                            value={securityForm.confirmPassword}
                            onChange={(e) => { setSecurityForm({...securityForm, confirmPassword: e.target.value}); setSecurityError(""); }}
                            className="pl-11 w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                      <div className="pt-4 flex items-center gap-4">
                        <button
                          type="submit"
                          disabled={securityLoading || !securityForm.oldPassword || !securityForm.newPassword}
                          className="bg-orange-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-orange-600 transition flex items-center gap-2 disabled:opacity-50"
                        >
                          {securityLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                          Update Password
                        </button>
                        {securitySuccess && <span className="text-green-600 flex items-center gap-1 font-medium"><CheckCircle2 className="w-5 h-5"/> Updated</span>}
                      </div>
                    </form>
                  </div>
                )}

                {/* NOTIFICATIONS TAB */}
                {activeTab === "notifications" && (
                  <div className="animate-in fade-in duration-300">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <Bell className="text-orange-500" /> Notifications
                    </h2>
                    <p className="text-gray-500 mb-8">Choose how you want to be notified about donations and updates.</p>

                    <div className="space-y-6 max-w-lg">
                      <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50">
                        <div>
                          <h3 className="font-semibold text-gray-800">Email Notifications</h3>
                          <p className="text-sm text-gray-500">Receive alerts via your registered email.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={preferences.emailNotifications} onChange={() => togglePreference("emailNotifications")} disabled={prefsLoading} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50">
                        <div>
                          <h3 className="font-semibold text-gray-800">Push Notifications</h3>
                          <p className="text-sm text-gray-500">Receive alerts in your browser/app.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={preferences.pushNotifications} onChange={() => togglePreference("pushNotifications")} disabled={prefsLoading} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* DELETE ACCOUNT TAB */}
                {activeTab === "delete" && (
                  <div className="animate-in fade-in duration-300">
                    <h2 className="text-2xl font-bold text-red-600 mb-6 flex items-center gap-2">
                      <AlertTriangle className="text-red-600" /> Danger Zone
                    </h2>
                    <div className="bg-red-50 p-6 rounded-2xl border border-red-100 max-w-lg">
                      <h3 className="text-red-800 font-bold mb-2">Delete Your Account</h3>
                      <p className="text-red-600 text-sm mb-6">
                        Once you delete your account, there is no going back. Please be certain. 
                        All your data, history, and preferences will be permanently wiped.
                      </p>
                      
                      {deleteError && <div className="mb-4 text-red-600 font-medium text-sm">{deleteError}</div>}
                      
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-red-800">
                          Type your email <span className="font-bold">({user?.email})</span> to confirm
                        </label>
                        <input
                          type="email"
                          value={deleteConfirm}
                          onChange={(e) => { setDeleteConfirm(e.target.value); setDeleteError(""); }}
                          className="w-full p-3.5 bg-white border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none text-red-900"
                          placeholder="user@example.com"
                        />
                        <button
                          onClick={handleDeleteAccount}
                          disabled={deleteLoading || deleteConfirm !== user?.email}
                          className="w-full bg-red-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {deleteLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

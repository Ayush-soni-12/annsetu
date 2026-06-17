import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import DashboardSidebar from "../components/DashboardSidebar";
import { useAuth } from "../context/AuthContext";
import { updateMe, changePassword, deleteAccount } from "../services/api";
import { 
  User, Mail, Lock, Bell, Trash2, Shield, Loader2, CheckCircle2, ChevronRight, AlertTriangle
} from "lucide-react";

// UI Components
const TabButton = ({ id, label, icon: Icon, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`flex items-center gap-3 p-4 rounded-xl transition-all whitespace-nowrap snap-start shrink-0 md:w-full md:justify-between ${
      activeTab === id 
        ? "bg-orange-50 text-orange-600 border border-orange-200 shadow-sm" 
        : "bg-white hover:bg-gray-50 text-gray-600 border border-gray-100 md:border-transparent md:bg-transparent"
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon className={`w-5 h-5 ${activeTab === id ? "text-orange-500" : "text-gray-400"}`} />
      <span className="font-semibold">{label}</span>
    </div>
    <ChevronRight className={`w-4 h-4 hidden md:block transition-opacity ${activeTab === id ? "opacity-100" : "opacity-0"}`} />
  </button>
);

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("account");

  // Local Form States
  const [accountForm, setAccountForm] = useState({ name: "", email: "" });
  const [securityForm, setSecurityForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [preferences, setPreferences] = useState({ emailNotifications: true, pushNotifications: true });
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLocalError, setDeleteLocalError] = useState("");
  const [securityLocalError, setSecurityLocalError] = useState("");

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAccountForm({ name: user.name || "", email: user.email || "" });
      if (user.preferences) {
         
        setPreferences({
          emailNotifications: user.preferences.emailNotifications ?? true,
          pushNotifications: user.preferences.pushNotifications ?? true
        });
      }
    }
  }, [user]);

  // Mutations
  const accountMutation = useMutation({
    mutationFn: (data) => updateMe(data),
    onSuccess: (res) => {
      if (res.data.success) {
        updateUser(res.data.user);
        setTimeout(() => accountMutation.reset(), 3000);
      }
    }
  });

  const securityMutation = useMutation({
    mutationFn: (data) => changePassword(data),
    onSuccess: () => {
      setSecurityForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => securityMutation.reset(), 3000);
    }
  });

  const prefsMutation = useMutation({
    mutationFn: (data) => updateMe(data),
    onSuccess: (res) => {
      if (res.data.success) {
        updateUser(res.data.user);
        setTimeout(() => prefsMutation.reset(), 2000);
      }
    },
    onError: () => {
      alert("Failed to update preferences");
      // Revert to user original state on error
      if (user?.preferences) {
        setPreferences({
          emailNotifications: user.preferences.emailNotifications ?? true,
          pushNotifications: user.preferences.pushNotifications ?? true
        });
      }
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteAccount(),
    onSuccess: () => {
      logout();
      navigate("/");
    }
  });

  // Handlers
  const handleAccountSubmit = (e) => {
    e.preventDefault();
    accountMutation.mutate({ name: accountForm.name });
  };

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    setSecurityLocalError("");
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      setSecurityLocalError("New passwords do not match.");
      return;
    }
    securityMutation.mutate({ 
      oldPassword: securityForm.oldPassword, 
      newPassword: securityForm.newPassword 
    });
  };

  const togglePreference = (key) => {
    const newValue = !preferences[key];
    const newPrefs = { ...preferences, [key]: newValue };
    setPreferences(newPrefs);
    prefsMutation.mutate({ preferences: newPrefs });
  };

  const handleDeleteAccount = () => {
    setDeleteLocalError("");
    if (deleteConfirm !== user.email) {
      setDeleteLocalError("Email doesn't match");
      return;
    }
    deleteMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex">
      <DashboardSidebar />
      <main className="flex-1 ml-0 lg:ml-72 min-h-screen overflow-y-auto p-6 md:p-8 pt-20 md:pt-8">
        <div className="max-w-5xl mx-auto">
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-500 mt-2">Manage your account preferences and security.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Left Sidebar Tabs */}
            <div className="col-span-1 flex overflow-x-auto md:flex-col gap-3 pb-2 md:pb-0 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              <TabButton id="account" label="Account Details" icon={User} activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton id="security" label="Security" icon={Shield} activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton id="notifications" label="Notifications" icon={Bell} activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton id="delete" label="Delete Account" icon={Trash2} activeTab={activeTab} setActiveTab={setActiveTab} />
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
                    {accountMutation.isError && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm">{accountMutation.error?.response?.data?.message || "Failed to update profile"}</div>}
                    
                    <form onSubmit={handleAccountSubmit} className="space-y-6 max-w-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={accountForm.name}
                            onChange={(e) => { setAccountForm({...accountForm, name: e.target.value}); accountMutation.reset(); }}
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
                          disabled={accountMutation.isPending || accountForm.name === user?.name}
                          className="bg-orange-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-orange-600 transition flex items-center gap-2 disabled:opacity-50"
                        >
                          {accountMutation.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
                          Save Changes
                        </button>
                        {accountMutation.isSuccess && <span className="text-green-600 flex items-center gap-1 font-medium"><CheckCircle2 className="w-5 h-5"/> Saved</span>}
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
                    {(securityLocalError || securityMutation.isError) && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm">{securityLocalError || securityMutation.error?.response?.data?.message || "Failed to change password"}</div>}

                    <form onSubmit={handleSecuritySubmit} className="space-y-6 max-w-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="password"
                            value={securityForm.oldPassword}
                            onChange={(e) => { setSecurityForm({...securityForm, oldPassword: e.target.value}); setSecurityLocalError(""); securityMutation.reset(); }}
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
                            onChange={(e) => { setSecurityForm({...securityForm, newPassword: e.target.value}); setSecurityLocalError(""); securityMutation.reset(); }}
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
                            onChange={(e) => { setSecurityForm({...securityForm, confirmPassword: e.target.value}); setSecurityLocalError(""); securityMutation.reset(); }}
                            className="pl-11 w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                      <div className="pt-4 flex items-center gap-4">
                        <button
                          type="submit"
                          disabled={securityMutation.isPending || !securityForm.oldPassword || !securityForm.newPassword}
                          className="bg-orange-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-orange-600 transition flex items-center gap-2 disabled:opacity-50"
                        >
                          {securityMutation.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
                          Update Password
                        </button>
                        {securityMutation.isSuccess && <span className="text-green-600 flex items-center gap-1 font-medium"><CheckCircle2 className="w-5 h-5"/> Updated</span>}
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
                          <input type="checkbox" className="sr-only peer" checked={preferences.emailNotifications} onChange={() => togglePreference("emailNotifications")} disabled={prefsMutation.isPending} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50">
                        <div>
                          <h3 className="font-semibold text-gray-800">Push Notifications</h3>
                          <p className="text-sm text-gray-500">Receive alerts in your browser/app.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={preferences.pushNotifications} onChange={() => togglePreference("pushNotifications")} disabled={prefsMutation.isPending} />
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
                      
                      {(deleteLocalError || deleteMutation.isError) && <div className="mb-4 text-red-600 font-medium text-sm">{deleteLocalError || deleteMutation.error?.response?.data?.message || "Failed to delete account"}</div>}
                      
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-red-800">
                          Type your email <span className="font-bold">({user?.email})</span> to confirm
                        </label>
                        <input
                          type="email"
                          value={deleteConfirm}
                          onChange={(e) => { setDeleteConfirm(e.target.value); setDeleteLocalError(""); deleteMutation.reset(); }}
                          className="w-full p-3.5 bg-white border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none text-red-900"
                          placeholder="user@example.com"
                        />
                        <button
                          onClick={handleDeleteAccount}
                          disabled={deleteMutation.isPending || deleteConfirm !== user?.email}
                          className="w-full bg-red-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {deleteMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
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

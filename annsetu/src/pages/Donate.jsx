import React, { useState } from "react";
import logo from "../assets/logo.jpeg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, UtensilsCrossed, History, User, Settings,
  UploadCloud, MapPin, Calendar, Truck, HeartHandshake, CheckCircle2, HelpCircle, LogOut
} from "lucide-react";

export default function AnnSetuApp() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  // State to manage which page is currently active
  const [activeTab, setActiveTab] = useState("donate");

  // State for the donation form
  const [formData, setFormData] = useState({
    foodName: "",
    foodType: "",
    quantity: "",
    serves: "",
    pickupTime: "",
    address: "",
    instructions: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl hover:bg-orange-50"
            >
              <LayoutDashboard size={20} />
              Dashboard
            </button>

            <button
              className="w-full flex items-center gap-3 bg-orange-500 text-white px-5 py-4 rounded-2xl"
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

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 w-full bg-[#f8fafc]">
        
        {/* Show Donate Food UI when 'donate' tab is active */}
        {activeTab === "donate" ? (
          <div className="w-full max-w-screen-2xl mx-auto">
            
            {/* Hero Banner (Wide Layout) */}
            <div className="bg-[#ff7b00] rounded-xl p-8 text-white mb-6 shadow-sm">
              <span className="bg-white/20 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide backdrop-blur-sm mb-4 inline-block">
                Share Food. Spread Happiness.
              </span>
              <h2 className="text-3xl font-bold mb-2">Together, we can<br/>end hunger 💛</h2>
              <p className="text-white/90 text-sm mt-2 max-w-xl">
                Donate your surplus food and help verified NGOs deliver meals to<br/>people who need them most.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <StatCard value="500+" label="Meals Donated" icon="🍴" />
              <StatCard value="50+" label="NGO Partners" icon="🤝" />
              <StatCard value="1000+" label="People Helped" icon="👥" />
              <StatCard value="2.5 Tons" label="Food Waste Prevented" icon="🍃" />
            </div>

            {/* Form and Preview Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-10">
              
              {/* Form Section (Wider portion) */}
              <div className="xl:col-span-3 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-base font-bold mb-6 text-gray-800">Donate Food Details</h3>
                
                <form className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <InputGroup label="Your Name" placeholder="Enter your name" />
                    <InputGroup label="Phone Number" placeholder="Enter your phone number" />
                    <InputGroup label="Food Name" name="foodName" placeholder="e.g. Veg Biryani, Dal, etc." onChange={handleChange} />
                    <SelectGroup label="Food Type" name="foodType" options={["Select food type", "Cooked Food", "Raw Ingredients", "Packaged Food"]} onChange={handleChange} />
                    <InputGroup label="Quantity" name="quantity" placeholder="e.g. 10 meals, 5 kg" onChange={handleChange} />
                    <InputGroup label="Serves How Many People?" name="serves" placeholder="e.g. 20 people" onChange={handleChange} />
                    
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-600 mb-1.5">Pickup Date & Time</label>
                      <input type="datetime-local" name="pickupTime" onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#ff7b00] focus:border-[#ff7b00] outline-none transition" />
                    </div>
                    
                    <SelectGroup label="Food Category" options={["Select category", "Vegetarian", "Non-Vegetarian", "Vegan"]} />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1.5">Pickup Address</label>
                    <div className="relative">
                      <input type="text" name="address" onChange={handleChange} placeholder="Enter complete pickup address" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#ff7b00] focus:border-[#ff7b00] outline-none pl-9 transition" />
                      <MapPin className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1.5">Special Instructions (Optional)</label>
                    <input type="text" name="instructions" onChange={handleChange} placeholder="Any special instructions for our team" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#ff7b00] focus:border-[#ff7b00] outline-none transition" />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1.5">Upload Food Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg py-8 text-center bg-gray-50/50 hover:bg-gray-50 transition cursor-pointer">
                      <UploadCloud className="mx-auto text-gray-400 mb-2" size={28} />
                      <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                      <p className="text-[11px] text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  </div>

                  <button type="button" className="w-full bg-[#ff7b00] text-white font-bold py-3.5 rounded-lg shadow-md hover:bg-[#e66a00] transition mt-2">
                    ♡ Donate Food Now
                  </button>
                  <p className="text-center text-[11px] text-gray-400 mt-2">🔒 Your information is safe with us and will not be shared.</p>
                </form>
              </div>

              {/* Preview Section (Narrower portion) */}
              <div className="xl:col-span-1">
                 <div className="bg-[#fff9f5] rounded-xl p-5 border border-[#ffe0cc] h-full shadow-sm">
                    <h3 className="text-sm font-bold mb-4 flex items-center text-gray-800">
                      <span className="text-[#ff7b00] mr-2 text-lg">👁</span> Donation Preview
                    </h3>
                    
                    <div className="bg-gray-200 rounded-lg h-36 mb-5 overflow-hidden flex items-center justify-center relative shadow-inner">
                      <img src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Food Preview" className="object-cover w-full h-full" />
                    </div>

                    <div className="space-y-3">
                      <PreviewItem label="Food Name" value={formData.foodName} icon="🍴" />
                      <PreviewItem label="Food Type" value={formData.foodType} icon="🏷" />
                      <PreviewItem label="Quantity" value={formData.quantity} icon="⚖" />
                      <PreviewItem label="Serves" value={formData.serves} icon="👥" />
                      <PreviewItem label="Pickup Time" value={formData.pickupTime} icon="⏱" />
                      <PreviewItem label="Address" value={formData.address} icon="📍" />
                      <PreviewItem label="Instructions" value={formData.instructions} icon="📝" />
                    </div>

                    <div className="mt-6 bg-[#ffeedb] p-3 rounded-lg flex items-start text-xs text-orange-800">
                      <HelpCircle className="mr-2 flex-shrink-0 mt-0.5 text-[#ff7b00]" size={14} />
                      <p>Please fill the form to see donation summary here.</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* How it works */}
            <div className="mb-10 w-full flex flex-col items-center">
              <div className="text-center mb-8 w-full">
                <h3 className="text-sm uppercase tracking-widest font-bold text-gray-400 flex items-center justify-center whitespace-nowrap">
                  <span className="w-12 h-px bg-gray-300 mr-4"></span>
                  How it works
                  <span className="w-12 h-px bg-gray-300 ml-4"></span>
                </h3>
              </div>
              
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-10 w-full max-w-4xl mx-auto">
                 <StepCard step="01" title="Submit Donation" desc="Fill the form with food details and pickup information." icon={<Calendar className="text-[#ff7b00]" size={20}/>} />
                 <div className="hidden md:block text-gray-300">→</div>
                 <StepCard step="02" title="We Pick Up" desc="Our team will pick up the food from your location." icon={<Truck className="text-yellow-500" size={20}/>} />
                 <div className="hidden md:block text-gray-300">→</div>
                 <StepCard step="03" title="Delivered to Needy" desc="Food is delivered to verified NGOs and people in need." icon={<HeartHandshake className="text-green-500" size={20}/>} />
              </div>
            </div>

            {/* Partners */}
            <div className="w-full flex flex-col items-center pb-10">
              <h3 className="text-sm font-bold mb-6 text-gray-800">Our Trusted NGO Partners</h3>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition duration-300 mb-6">
                 <div className="font-bold text-sm text-gray-600 flex flex-col items-center"><span className="text-xl mb-1">🏹</span> Robin Hood Army</div>
                 <div className="font-bold text-sm text-gray-600 flex flex-col items-center"><span className="text-xl mb-1">🇮🇳</span> Feeding India</div>
                 <div className="font-bold text-sm text-gray-600 flex flex-col items-center"><span className="text-xl mb-1">👴</span> HelpAge India</div>
                 <div className="font-bold text-sm text-gray-600 flex flex-col items-center"><span className="text-xl mb-1">🥘</span> Akshaya Patra</div>
                 <div className="font-bold text-sm text-gray-600 flex flex-col items-center"><span className="text-xl mb-1">🧵</span> GOONJ..</div>
              </div>
              <div className="flex items-center justify-center text-xs text-green-600 font-medium bg-green-50 px-4 py-2 rounded-full">
                 <CheckCircle2 size={14} className="mr-2" /> We ensure safe handling, on-time pickup and transparent delivery.
              </div>
            </div>

          </div>
        ) : (
          /* Placeholder for other tabs like Dashboard */
          <div className="h-full flex items-center justify-center text-gray-400 flex-col">
             <LayoutDashboard size={48} className="mb-4 text-gray-300" />
             <h2 className="text-xl font-medium">You are currently on the <span className="text-[#ff7b00] font-bold capitalize">{activeTab}</span> page.</h2>
             <p className="mt-2 text-sm">Click "Donate Food" in the sidebar to see the main UI.</p>
          </div>
        )}

      </main>
    </div>
  );
}

/* --- Utility Components --- */

function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center px-5 py-3.5 rounded-xl transition-all duration-200 ${
        isActive 
        ? "bg-[#ff7b00] text-white font-semibold shadow-md shadow-orange-500/30" 
        : "bg-transparent text-gray-700 hover:bg-gray-50 font-medium"
      }`}
    >
      <span className={`mr-4 ${isActive ? "text-white" : "text-gray-500"}`}>{icon}</span>
      <span className="text-base">{label}</span>
    </button>
  );
}

function StatCard({ value, label, icon }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center shadow-sm">
      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-lg mr-3">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-base text-gray-800 leading-tight">{value}</h4>
        <p className="text-[11px] text-gray-500 font-medium">{label}</p>
      </div>
    </div>
  );
}

function InputGroup({ label, placeholder, name, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <input 
        type="text" 
        name={name}
        onChange={onChange}
        placeholder={placeholder} 
        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#ff7b00] focus:border-[#ff7b00] outline-none transition" 
      />
    </div>
  );
}

function SelectGroup({ label, options, name, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <select 
        name={name}
        onChange={onChange}
        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#ff7b00] focus:border-[#ff7b00] outline-none bg-white text-gray-600 transition">
        {options.map((opt, idx) => (
          <option key={idx} value={idx === 0 ? "" : opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function PreviewItem({ label, value, icon }) {
  return (
    <div className="flex justify-between items-center text-xs border-b border-[#ffe0cc]/60 pb-2">
      <span className="text-gray-500 flex items-center"><span className="mr-2 text-sm">{icon}</span> {label}</span>
      <span className="font-medium text-gray-800 text-right max-w-[50%] truncate">
        {value || <span className="text-gray-400 font-normal">Not added</span>}
      </span>
    </div>
  );
}

function StepCard({ step, title, desc, icon }) {
  return (
    <div className="flex items-start max-w-[240px]">
      <div className="relative mr-3 flex-shrink-0 mt-0.5">
        <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white shadow-sm">
           {icon}
        </div>
        <div className="absolute -top-1 -right-1 bg-white text-[#ff7b00] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm border border-gray-100">
          {step}
        </div>
      </div>
      <div>
        <h4 className="font-bold text-gray-800 text-xs">{title}</h4>
        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
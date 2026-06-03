import { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import {
  UploadCloud, MapPin, HelpCircle,
} from "lucide-react";

export default function Donate() {

  const [formData, setFormData] = useState({
    foodName: "",
    foodType: "",
    quantity: "",
    serves: "",
    pickupTime: "",
    address: "",
    instructions: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex">

      {/* Fixed Sidebar */}
      <DashboardSidebar />

      {/* Main Content — offset by sidebar width, independently scrollable */}
      <main className="flex-1 ml-0 lg:ml-72 min-h-screen overflow-y-auto p-6 md:p-8 bg-[#f8fafc]">
        <div className="w-full max-w-screen-2xl mx-auto">

          {/* Hero Banner */}
          <div className="bg-[#ff7b00] rounded-xl p-8 text-white mb-6 shadow-sm">
            <span className="bg-white/20 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase backdrop-blur-sm mb-4 inline-block">
              Share Food. Spread Happiness.
            </span>
            <h2 className="text-4xl font-extrabold mb-2 tracking-tight">Together, we can<br />end hunger 💛</h2>
            <p className="text-white/80 text-sm mt-3 max-w-xl leading-relaxed">
              Donate your surplus food and help verified NGOs deliver meals to people who need them most.
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard value="500+" label="Meals Donated" icon="🍴" />
            <StatCard value="50+" label="NGO Partners" icon="🤝" />
            <StatCard value="1000+" label="People Helped" icon="👥" />
            <StatCard value="2.5 Tons" label="Food Waste Prevented" icon="🍃" />
          </div>

          {/* Form + Preview */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-10">

            {/* Form */}
            <div className="xl:col-span-3 bg-white rounded-xl p-7 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-1 text-gray-900">Donate Food Details</h3>
              <p className="text-xs text-gray-400 mb-6">Fill in the details below and we'll coordinate the pickup.</p>

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

                <button type="button" className="w-full bg-[#ff7b00] text-white font-bold py-4 rounded-xl shadow-md hover:bg-[#e66a00] active:scale-[0.98] transition-all mt-2 text-sm tracking-wide">
                  ♡ &nbsp;Donate Food Now
                </button>
                <p className="text-center text-[11px] text-gray-400 mt-3 tracking-wide">🔒 &nbsp;Your information is safe and will never be shared.</p>
              </form>
            </div>

            {/* Preview */}
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
                  <HelpCircle className="mr-2 shrink-0 mt-0.5 text-[#ff7b00]" size={14} />
                  <p>Please fill the form to see donation summary here.</p>
                </div>
              </div>
            </div>
          </div>



        </div>
      </main>
    </div>
  );
}

/* --- Utility Components --- */

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
        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#ff7b00] focus:border-[#ff7b00] outline-none bg-white text-gray-600 transition"
      >
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
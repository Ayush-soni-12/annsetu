import { useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import { UploadCloud, MapPin, HelpCircle, Building2 } from "lucide-react";
import { useCreateDonation } from "../hooks/useDonations";
import { useGlobalStats } from "../hooks/useGlobalStats";
import { uploadImage } from "../services/api";
import { donationSchema } from "../validations/donationSchema";
import { parseZodErrors } from "../validations/parseZodErrors";


export default function Donate() {
  const location = useLocation();
  const preferredNgo = location.state?.preferredNgo;
  const ngoName = location.state?.ngoName;

  const [formData, setFormData] = useState({
    donorName: "",
    phone: "",
    foodName: "",
    foodType: "",
    foodCategory: "",
    quantity: "",
    serves: "",
    pickupTime: "",
    address: "",
    instructions: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch global stats
  const { data: globalStats } = useGlobalStats();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFieldErrors((prev) => ({ ...prev, image: "Image must be less than 5MB" }));
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setFieldErrors((prev) => ({ ...prev, image: undefined }));
    }
  };

  const { mutate, isPending, isSuccess, isError, error, reset } = useCreateDonation({
    onSuccess: () => {
      setFormData({
        donorName: "", phone: "", foodName: "", foodType: "",
        foodCategory: "", quantity: "", serves: "",
        pickupTime: "", address: "", instructions: "",
      });
      setFieldErrors({});
      setImageFile(null);
      setImagePreview(null);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    reset();
    setFieldErrors({});
    setImageFile(null);
    setImagePreview(null);

    const result = donationSchema.safeParse(formData);
    if (!result.success) {
      setFieldErrors(parseZodErrors(result));
      return;
    }

    try {
      let foodImageUrl = undefined;
      
      // If the user selected an image, upload it first
      if (imageFile) {
        setIsUploading(true);
        const imgData = new FormData();
        imgData.append("image", imageFile);
        
        const uploadRes = await uploadImage(imgData);
        foodImageUrl = uploadRes.data.imageUrl;
      }

      // Submit the donation with the image URL (if any) and preferred NGO
      mutate({ ...formData, foodImageUrl, assignedNgo: preferredNgo });
    } catch (err) {
      setFieldErrors((prev) => ({ 
        ...prev, 
        image: err.response?.data?.message || "Failed to upload image. Please try again." 
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const formatPickupPreview = (val) => {
    if (!val || val.trim() === "") return "";
    const [year, month, day] = val.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-IN", { dateStyle: "medium" });
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex">
      <DashboardSidebar />

      <main className="flex-1 ml-0 lg:ml-72 min-h-screen overflow-y-auto p-6 md:p-8 bg-[#f8fafc]">
        <div className="w-full max-w-screen-2xl mx-auto">

          {preferredNgo && (
            <div className="bg-linear-to-r from-orange-500 to-red-500 rounded-xl p-5 text-white mb-6 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-sm">
                  <Building2 size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-orange-100 text-xs font-semibold tracking-widest uppercase mb-0.5">Direct Donation</p>
                  <p className="font-bold text-lg">Donating to: {ngoName}</p>
                </div>
              </div>
              <p className="hidden sm:block text-sm text-orange-100 bg-black/10 px-4 py-2.5 rounded-xl backdrop-blur-sm">
                Your donation will bypass the matching pool and go directly to them.
              </p>
            </div>
          )}

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
            <StatCard value={globalStats ? `${globalStats.mealsDonated}+` : "..."} label="Meals Donated" icon="🍴" />
            <StatCard value={globalStats ? `${globalStats.ngoPartners}+` : "..."} label="NGO Partners" icon="🤝" />
            <StatCard value={globalStats ? `${globalStats.peopleHelped}+` : "..."} label="People Helped" icon="👥" />
            <StatCard value={globalStats ? globalStats.wastePrevented : "..."} label="Food Waste Prevented" icon="🍃" />
          </div>

          {/* Form + Preview */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-10">

            {/* Form */}
            <div className="xl:col-span-3 bg-white rounded-xl p-7 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-1 text-gray-900">Donate Food Details</h3>
              <p className="text-xs text-gray-400 mb-6">Fill in the details below and we'll coordinate the pickup.</p>

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <InputGroup label="Your Name" name="donorName" value={formData.donorName} placeholder="Enter your name" onChange={handleChange} error={fieldErrors.donorName} />
                  <InputGroup label="Phone Number" name="phone" value={formData.phone} placeholder="Enter your phone number" onChange={handleChange} error={fieldErrors.phone} />
                  <InputGroup label="Food Name" name="foodName" value={formData.foodName} placeholder="e.g. Veg Biryani, Dal, etc." onChange={handleChange} error={fieldErrors.foodName} />
                  <SelectGroup label="Food Type" name="foodType" value={formData.foodType} options={["Select food type", "Cooked Food", "Raw Ingredients", "Packaged Food"]} onChange={handleChange} error={fieldErrors.foodType} />
                  <InputGroup label="Quantity" name="quantity" value={formData.quantity} placeholder="e.g. 10 meals, 5 kg" onChange={handleChange} error={fieldErrors.quantity} />
                  <InputGroup label="Serves How Many People?" name="serves" value={formData.serves} placeholder="e.g. 20" onChange={handleChange} error={fieldErrors.serves} />

                  {/* Pickup DateTime */}
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1.5">Pickup Date</label>
                    <input
                      type="date"
                      name="pickupTime"
                      value={formData.pickupTime}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={handleChange}
                      className={`w-full border rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#ff7b00] focus:border-[#ff7b00] outline-none transition ${fieldErrors.pickupTime ? "border-red-400" : "border-gray-200"}`}
                    />
                    {fieldErrors.pickupTime && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.pickupTime}</p>
                    )}
                  </div>

                  <SelectGroup label="Food Category" name="foodCategory" value={formData.foodCategory} options={["Select category", "Vegetarian", "Non-Vegetarian", "Vegan"]} onChange={handleChange} error={fieldErrors.foodCategory} />
                </div>

                {/* Address */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1.5">Pickup Address</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter complete pickup address"
                      className={`w-full border rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#ff7b00] focus:border-[#ff7b00] outline-none pl-9 transition ${fieldErrors.address ? "border-red-400" : "border-gray-200"}`}
                    />
                    <MapPin className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  </div>
                  {fieldErrors.address && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.address}</p>
                  )}
                </div>

                {/* Instructions */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1.5">Special Instructions (Optional)</label>
                  <input
                    type="text"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    placeholder="Any special instructions for our team"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#ff7b00] focus:border-[#ff7b00] outline-none transition"
                  />
                </div>

                {/* Image Upload */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 mb-1.5">Food Image (Optional)</label>
                  <label className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition ${fieldErrors.image ? "border-red-400 bg-red-50" : "border-gray-200 hover:bg-gray-50 hover:border-[#ff7b00]"}`}>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    <UploadCloud size={28} className={fieldErrors.image ? "text-red-400 mb-2" : "text-gray-400 mb-2"} />
                    <span className="text-sm font-medium text-gray-700">
                      {imageFile ? imageFile.name : "Click to upload an image"}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                  </label>
                  {fieldErrors.image && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.image}</p>
                  )}
                </div>

                {isSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
                    ✅ &nbsp;Donation submitted! Our team will contact you soon.
                  </div>
                )}
                {isError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                    ❌ &nbsp;{error?.response?.data?.message || "Something went wrong. Try again."}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPending || isUploading}
                  className="w-full bg-[#ff7b00] text-white font-bold py-4 rounded-xl shadow-md hover:bg-[#e66a00] active:scale-[0.98] transition-all mt-2 text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {(isPending || isUploading) ? "Submitting..." : "♡ \u00a0Donate Food Now"}
                </button>
                <p className="text-center text-[11px] text-gray-400 mt-3 tracking-wide">🔒 &nbsp;Your information is safe and will never be shared.</p>
              </form>
            </div>

            {/* Preview Panel */}
            <div className="xl:col-span-1">
              <div className="bg-[#fff9f5] rounded-xl p-5 border border-[#ffe0cc] h-full shadow-sm">
                <h3 className="text-sm font-bold mb-4 flex items-center text-gray-800">
                  <span className="text-[#ff7b00] mr-2 text-lg">👁</span> Donation Preview
                </h3>

                <div className="bg-gray-200 rounded-lg h-36 mb-5 overflow-hidden flex items-center justify-center relative shadow-inner">
                  <img 
                    src={imagePreview || "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                    alt="Food Preview" 
                    className="object-cover w-full h-full" 
                  />
                </div>

                <div className="space-y-3">
                  <PreviewItem label="Food Name" value={formData.foodName} icon="🍴" />
                  <PreviewItem label="Food Type" value={formData.foodType} icon="🏷" />
                  <PreviewItem label="Quantity" value={formData.quantity} icon="⚖" />
                  <PreviewItem label="Serves" value={formData.serves} icon="👥" />
                  <PreviewItem label="Pickup Date" value={formatPickupPreview(formData.pickupTime)} icon="⏱" />
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

function InputGroup({ label, placeholder, name, value, onChange, error }) {
  return (
    <div className="flex flex-col">
      <label className="text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <input
        type="text"
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#ff7b00] focus:border-[#ff7b00] outline-none transition ${error ? "border-red-400" : "border-gray-200"}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function SelectGroup({ label, options, name, value, onChange, error }) {
  return (
    <div className="flex flex-col">
      <label className="text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <select
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className={`w-full border rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#ff7b00] focus:border-[#ff7b00] outline-none bg-white text-gray-600 transition ${error ? "border-red-400" : "border-gray-200"}`}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={idx === 0 ? "" : opt}>{opt}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
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
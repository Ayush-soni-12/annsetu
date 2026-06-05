import { useParams, Link } from "react-router-dom";
import { useNgoById } from "../hooks/useNgos";
import {
  MapPin, Phone, Globe, Users, Utensils,
  Clock, Loader2, Building2, ChevronLeft, Calendar
} from "lucide-react";

export default function NgoProfileView() {
  const { id } = useParams();

  const { data, isLoading, isError } = useNgoById(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center text-gray-400 gap-3">
        <Loader2 className="animate-spin" size={28} />
        <span>Loading NGO details...</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center text-gray-500">
        <Building2 size={64} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">NGO Not Found</h2>
        <p className="mt-2 text-sm">The NGO profile you are looking for does not exist or has not been verified yet.</p>
        <Link to="/ngos" className="mt-6 text-orange-500 hover:underline">
          ← Back to Directory
        </Link>
      </div>
    );
  }

  const ngo = data;

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* ── Top Cover Area ─────────────────────────────────────── */}
      <div className="h-64 bg-linear-to-r from-orange-400 to-red-400 w-full object-cover relative">
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20 relative -mt-24">
        
        {/* ── Profile Header Card ──────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            
            {/* Logo */}
            <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-sm shrink-0 -mt-16 relative z-10 border border-gray-100">
              <div className="w-full h-full bg-orange-50 rounded-2xl flex items-center justify-center overflow-hidden">
                {ngo.logoUrl ? (
                  <img src={ngo.logoUrl} alt={ngo.orgName} className="w-full h-full object-cover" />
                ) : (
                  <Building2 size={40} className="text-orange-400" />
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{ngo.orgName}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-1.5"><MapPin size={16} /> {ngo.city}, {ngo.state}</span>
                {ngo.contactPhone && (
                  <a href={`tel:${ngo.contactPhone}`} className="flex items-center gap-1.5 hover:text-orange-500 transition-colors">
                    <Phone size={16} /> {ngo.contactPhone}
                  </a>
                )}
                {ngo.website && (
                  <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-orange-500 transition-colors">
                    <Globe size={16} /> Website
                  </a>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto">
              <Link to="/donate" state={{ preferredNgo: ngo._id, ngoName: ngo.orgName }} className="bg-orange-500 hover:bg-orange-600 text-white text-center px-8 py-3 rounded-2xl font-bold transition-all shadow-md shadow-orange-500/20">
                Donate to us
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">About Us</h3>
            <p className="text-gray-700 leading-relaxed">
              {ngo.description || "This NGO hasn't provided a detailed description yet, but they are an active part of the Annsetu network fighting hunger in their community."}
            </p>
          </div>
        </div>

        {/* ── Details Grid ─────────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Left Col: Preferences & Capacity */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Utensils className="text-orange-500" /> Food Requirements
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-bold text-gray-400 mb-2">Dietary Preferences</p>
                  <div className="flex flex-wrap gap-2">
                    {ngo.dietaryPref?.map(p => (
                      <span key={p} className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-semibold">{p}</span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-bold text-gray-400 mb-2">Accepted Food Types</p>
                  <div className="flex flex-wrap gap-2">
                    {ngo.acceptedFoodTypes?.map(t => (
                      <span key={t} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium">{t}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-400 mb-1">Daily Capacity</p>
                  <p className="font-semibold text-gray-900">{ngo.capacityMeals} meals/day</p>
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-400 mb-1">Focus Area</p>
                  <p className="font-semibold text-gray-900">{ngo.focusArea}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="text-orange-500" /> Location & Contact
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-bold text-gray-400 mb-1">Full Address</p>
                  <p className="text-gray-800 font-medium">{ngo.address}</p>
                  <p className="text-gray-600 text-sm mt-0.5">{ngo.city}, {ngo.state} {ngo.pincode}</p>
                </div>
                <div className="pt-4 border-t border-gray-50 flex gap-8">
                  <div>
                    <p className="text-sm font-bold text-gray-400 mb-1">Operating Hours</p>
                    <p className="text-gray-800 font-medium flex items-center gap-1.5"><Clock size={16} className="text-gray-400"/> {ngo.operatingHours}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 mb-1">Contact Person</p>
                    <p className="text-gray-800 font-medium">{ngo.user?.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Impact & Trust */}
          <div className="space-y-8">
            <div className="bg-linear-to-br from-orange-500 to-red-500 rounded-3xl shadow-lg p-8 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
              <h3 className="font-bold text-orange-100 mb-6 uppercase tracking-wider text-sm">Our Impact</h3>
              
              <div className="mb-6">
                <p className="text-5xl font-black mb-1">{ngo.totalMealsReceived.toLocaleString()}</p>
                <p className="text-sm font-medium text-orange-100">Meals Received via Annsetu</p>
              </div>
              
              <div>
                <p className="text-2xl font-bold mb-1">{ngo.totalDonationsReceived}</p>
                <p className="text-sm font-medium text-orange-100">Total Donations</p>
              </div>
            </div>

            <div className="bg-green-50 rounded-3xl p-6 border border-green-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
                <h3 className="font-bold text-green-800">Verified Partner</h3>
              </div>
              <p className="text-sm text-green-700 leading-relaxed ml-11">
                This NGO has been vetted and approved by the Annsetu team. 
                {ngo.registrationNo && <><br/><br/>Registration No: <span className="font-mono bg-white px-1.5 py-0.5 rounded text-xs">{ngo.registrationNo}</span></>}
              </p>
            </div>
            
            <Link to="/ngos" className="flex items-center justify-center gap-2 w-full py-4 text-gray-500 hover:text-gray-800 font-semibold transition-colors">
              <ChevronLeft size={18} /> Back to Directory
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

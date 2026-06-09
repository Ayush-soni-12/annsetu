import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BadgeCheck,
  CalendarDays,
  Check,
  CircleUserRound,
  Edit3,
  Gift,
  HeartHandshake,
  Loader2,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  Scale,
  Soup,
  Trophy,
  Truck,
  X,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import { useAuth } from "../context/AuthContext";
import { DONATION_KEYS, useMyDonations, useMyStats } from "../hooks/useDonations";
import { getMe, updateMe } from "../services/api";
import impactImage from "../assets/impact.png";

const panelClass =
  "overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm";

const formatMonthYear = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(date);
};

export default function ProfilePage() {
  const { user: storedUser, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const {
    data: liveUser,
    isLoading: userLoading,
    isError: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => getMe().then((response) => response.data.user),
    initialData: storedUser || undefined,
    refetchInterval: 10000,
    staleTime: 0,
  });

  const {
    data: stats = {},
    isLoading: statsLoading,
    isError: statsError,
    refetch: refetchStats,
  } = useMyStats({ refetchInterval: 10000 });
  const { data: donations = [] } = useMyDonations({
    refetchInterval: 10000,
  });

  const user = liveUser || storedUser;
  const latestDonation = donations[0];
  const phone = user?.phone || latestDonation?.phone || "Not added";
  const location = user?.location || latestDonation?.address || "Not added";

  const initials = useMemo(
    () =>
      (user?.name || "AnnSetu User")
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase(),
    [user?.name],
  );

  const saveProfile = useMutation({
    mutationFn: updateMe,
    onSuccess: (response) => {
      const updatedUser = response.data.user;
      updateUser(updatedUser);
      queryClient.setQueryData(["auth", "me"], updatedUser);
      setMessage("Profile updated successfully.");
      setIsEditing(false);
    },
    onError: (error) => {
      setMessage(
        error?.response?.data?.message || "Could not update your profile.",
      );
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");
    saveProfile.mutate(Object.fromEntries(new FormData(event.currentTarget)));
  };

  const refreshProfile = () => {
    refetchUser();
    refetchStats();
    queryClient.invalidateQueries({ queryKey: DONATION_KEYS.myList });
  };

  if (userLoading && !user) {
    return (
      <div className="flex min-h-screen bg-[#faf8f5]">
        <DashboardSidebar />
        <main className="ml-0 grid min-h-screen flex-1 place-items-center lg:ml-72">
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="animate-spin" size={20} />
            Loading your profile...
          </div>
        </main>
      </div>
    );
  }

  if (userError && !user) {
    return (
      <div className="flex min-h-screen bg-[#faf8f5]">
        <DashboardSidebar />
        <main className="ml-0 grid min-h-screen flex-1 place-items-center px-6 text-center lg:ml-72">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              We could not load your profile
            </h1>
            <p className="mt-2 text-gray-500">
              Check that the AnnSetu backend is running.
            </p>
            <button
              className="mt-5 rounded-lg bg-orange-500 px-5 py-3 font-bold text-white hover:bg-orange-600"
              onClick={refreshProfile}
              type="button"
            >
              Try again
            </button>
          </div>
        </main>
      </div>
    );
  }

  const statCards = [
    {
      label: "Meals Donated",
      value: stats.totalMeals || 0,
      detail: "Total meals you have donated",
      Icon: Soup,
      color: "bg-orange-500",
      text: "text-orange-600",
    },
    {
      label: "Total Donations",
      value: stats.totalDonations || 0,
      detail: "Food donations you have made",
      Icon: Gift,
      color: "bg-amber-500",
      text: "text-amber-600",
    },
    {
      label: "Deliveries Done",
      value: stats.deliveredCount || 0,
      detail: "Successful deliveries completed",
      Icon: Truck,
      color: "bg-green-600",
      text: "text-green-700",
    },
    {
      label: "CO2 Saved (kg)",
      value: stats.co2Saved || 0,
      detail: "Estimated environmental impact",
      Icon: Scale,
      color: "bg-purple-600",
      text: "text-purple-700",
    },
  ];

  const badges = [
    {
      name: "First Donation",
      description: "Complete your first food donation",
      unlocked: (stats.totalDonations || 0) >= 1,
    },
    {
      name: "Food Hero",
      description: "Complete 25 food donations",
      unlocked: (stats.totalDonations || 0) >= 25,
    },
    {
      name: "Community Champion",
      description: "Help provide 100 meals",
      unlocked: (stats.totalMeals || 0) >= 100,
    },
  ];

  const roleLabel =
    user?.role === "NGO"
      ? "AnnSetu NGO Partner"
      : user?.role === "ADMIN"
        ? "AnnSetu Administrator"
        : "AnnSetu Food Donor";

  return (
    <div className="flex min-h-screen bg-[#faf8f5] text-gray-900">
      <DashboardSidebar />

      <main className="ml-0 min-h-screen flex-1 overflow-y-auto p-4 sm:p-6 lg:ml-72 lg:p-8">
        <div className="mx-auto w-full max-w-6xl">
          <header className="mb-6 flex items-end justify-between gap-5">
            <div>
              <h1 className="text-3xl font-extrabold sm:text-4xl">My Profile</h1>
              <p className="mt-2 text-gray-500">
                Manage your information and track your impact with AnnSetu.
              </p>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-2 text-xs font-bold text-green-700 hover:bg-green-100"
              type="button"
              onClick={refreshProfile}
              title="Refresh profile"
            >
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="hidden sm:inline">Live profile</span>
            </button>
          </header>

          <section
            className={`${panelClass} grid grid-cols-1 items-center gap-7 p-5 text-center md:grid-cols-[140px_1fr] md:text-left xl:grid-cols-[150px_1fr_250px]`}
          >
            <div className="mx-auto grid h-36 w-36 place-items-center overflow-hidden rounded-full border-8 border-orange-50 bg-orange-500 text-4xl font-extrabold text-white">
              {user?.avatarUrl ? (
                <img
                  className="h-full w-full object-cover"
                  src={user.avatarUrl}
                  alt={`${user.name} profile`}
                />
              ) : (
                initials
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <h2 className="text-2xl font-extrabold sm:text-3xl">
                  {user?.name}
                </h2>
                {user?.isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
                    <BadgeCheck size={15} /> Verified
                  </span>
                )}
              </div>
              <p className="mb-4 mt-2 font-extrabold text-orange-600">
                {roleLabel}
              </p>
              <div className="grid justify-items-center gap-2.5 text-sm text-gray-600 md:justify-items-start">
                <ContactRow Icon={Mail} value={user?.email} />
                <ContactRow Icon={Phone} value={phone} />
                <ContactRow Icon={MapPin} value={location} />
                <ContactRow
                  Icon={CalendarDays}
                  value={`Joined ${formatMonthYear(user?.createdAt)}`}
                />
              </div>
            </div>

            <div className="col-span-1 grid min-h-32 place-items-center gap-3 rounded-lg border border-orange-100 bg-orange-50 p-6 text-center font-bold leading-relaxed md:col-span-2 xl:col-span-1">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-orange-500 shadow-sm">
                <HeartHandshake size={27} />
              </span>
              "Together, we can build a hunger-free and better world."
            </div>
          </section>

          {statsError && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Donation statistics are temporarily unavailable.
            </div>
          )}

          <section className="my-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map(({ Icon, ...card }) => (
              <article
                className={`${panelClass} grid min-h-36 grid-cols-[56px_1fr] gap-3 p-5`}
                key={card.label}
              >
                <span
                  className={`grid h-13 w-13 place-items-center rounded-full text-white ${card.color}`}
                >
                  {statsLoading ? (
                    <Loader2 className="animate-spin" size={22} />
                  ) : (
                    <Icon size={23} />
                  )}
                </span>
                <div>
                  <strong className="text-3xl font-extrabold">
                    {statsLoading ? "-" : card.value}
                  </strong>
                  <h3 className={`mt-1 font-extrabold ${card.text}`}>
                    {card.label}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-500">
                    {card.detail}
                  </p>
                </div>
              </article>
            ))}
          </section>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <section className={`${panelClass} p-5 sm:p-6`}>
              <PanelHeading Icon={CircleUserRound}>
                Personal Information
              </PanelHeading>
              <dl className="mb-5">
                <DetailRow label="Full Name" value={user?.name} />
                <DetailRow label="Email Address" value={user?.email} />
                <DetailRow label="Phone Number" value={phone} />
                <DetailRow label="Location" value={location} />
                <DetailRow
                  label="Member Since"
                  value={formatMonthYear(user?.createdAt)}
                />
              </dl>
              <button
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-orange-500 px-5 font-bold text-orange-600 hover:bg-orange-50"
                type="button"
                onClick={() => {
                  setMessage("");
                  setIsEditing(true);
                }}
              >
                <Edit3 size={17} /> Edit Profile
              </button>
              {message && (
                <p className="mt-3 text-sm text-green-700" role="status">
                  {message}
                </p>
              )}
            </section>

            <section className={panelClass}>
              <div className="px-5 pt-5 sm:px-6 sm:pt-6">
                <PanelHeading Icon={Trophy}>
                  Your AnnSetu Badges
                </PanelHeading>
              </div>
              <div className="px-4 sm:px-5">
                {badges.map((badge, index) => (
                  <article
                    className="grid min-h-20 grid-cols-[52px_1fr_auto] items-center gap-3 border-b border-gray-100 py-3"
                    key={badge.name}
                  >
                    <span
                      className={`grid h-12 w-12 place-items-center rounded-full border-4 text-white ${
                        badge.unlocked
                          ? index === 0
                            ? "border-amber-200 bg-amber-500"
                            : index === 1
                              ? "border-orange-200 bg-orange-500"
                              : "border-green-200 bg-green-600"
                          : "border-gray-200 bg-gray-300"
                      }`}
                    >
                      <PackageCheck size={21} />
                    </span>
                    <div>
                      <h3 className="font-extrabold">{badge.name}</h3>
                      <p className="text-xs text-gray-500">
                        {badge.description}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold ${
                        badge.unlocked ? "text-green-700" : "text-gray-400"
                      }`}
                    >
                      {badge.unlocked && <Check size={14} />}
                      {badge.unlocked ? "Unlocked" : "Locked"}
                    </span>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <section className="mt-5 flex min-h-40 items-center justify-between overflow-hidden rounded-lg border border-orange-100 bg-orange-50 pl-5 sm:pl-7">
            <div className="relative z-10 shrink-0 py-5">
              <h2 className="text-xl font-extrabold text-orange-950">
                Your Impact Matters!
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Thank you for being part of AnnSetu.
                <br />
                Your kindness is changing lives.
              </p>
            </div>
            <img
              className="h-40 w-1/2 object-cover object-center"
              src={impactImage}
              alt="AnnSetu community impact"
            />
          </section>
        </div>
      </main>

      {isEditing && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-5"
          onMouseDown={() => setIsEditing(false)}
          role="presentation"
        >
          <section
            className="w-full max-w-lg rounded-lg bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase text-orange-600">
                  Account details
                </p>
                <h2
                  className="mt-1 text-2xl font-extrabold"
                  id="edit-profile-title"
                >
                  Edit Profile
                </h2>
              </div>
              <button
                className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 hover:bg-gray-50"
                type="button"
                aria-label="Close"
                onClick={() => setIsEditing(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form className="grid gap-4" onSubmit={handleSubmit}>
              <ProfileInput
                label="Full name"
                name="name"
                defaultValue={user?.name || ""}
              />
              <ProfileInput
                label="Phone number"
                name="phone"
                defaultValue={user?.phone || latestDonation?.phone || ""}
              />
              <ProfileInput
                label="Location"
                name="location"
                defaultValue={user?.location || latestDonation?.address || ""}
              />
              <ProfileInput
                label="Avatar URL"
                name="avatarUrl"
                type="url"
                required={false}
                defaultValue={user?.avatarUrl || ""}
              />
              {saveProfile.isError && (
                <p className="text-sm text-red-600">{message}</p>
              )}
              <div className="mt-2 flex justify-end gap-3">
                <button
                  className="min-h-11 rounded-lg border border-gray-200 px-5 font-bold text-gray-600 hover:bg-gray-50"
                  type="button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  className="min-h-11 rounded-lg bg-orange-500 px-5 font-bold text-white hover:bg-orange-600 disabled:cursor-wait disabled:opacity-60"
                  type="submit"
                  disabled={saveProfile.isPending}
                >
                  {saveProfile.isPending ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

function ContactRow({ Icon, value }) {
  return (
    <div className="flex max-w-full items-center gap-3 text-left">
      <Icon className="shrink-0 text-gray-400" size={18} />
      <span className="[overflow-wrap:anywhere]">{value || "Not added"}</span>
    </div>
  );
}

function PanelHeading({ Icon, children }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-gray-200 pb-4">
      <Icon className="text-orange-500" size={21} />
      <h2 className="text-lg font-extrabold">{children}</h2>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-gray-100 py-3.5 sm:grid-cols-[150px_1fr] sm:gap-5">
      <dt className="font-bold">{label}</dt>
      <dd className="m-0 text-gray-600 [overflow-wrap:anywhere]">
        {value || "Not added"}
      </dd>
    </div>
  );
}

function ProfileInput({
  label,
  required = true,
  type = "text",
  ...inputProps
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-gray-700">
      {label}
      <input
        className="min-h-11 rounded-lg border border-gray-300 px-3 font-normal outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
        type={type}
        required={required}
        {...inputProps}
      />
    </label>
  );
}

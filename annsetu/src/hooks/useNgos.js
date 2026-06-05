import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllNgos, getNgoById, getMyNgoProfile, updateMyNgoProfile } from "../services/api";

// ── Query Keys ──────────────────────────────────────────────────
export const NGO_KEYS = {
  all:       ["ngos"],
  list:      (city) => ["ngos", "list", city ?? ""],
  detail:    (id)   => ["ngos", "detail", id],
  myProfile: ["ngos", "myProfile"],
};

// ── Public: full NGO directory (optionally filtered by city) ────
export function useAllNgos(city = "") {
  return useQuery({
    queryKey: NGO_KEYS.list(city),
    queryFn:  () =>
      getAllNgos(city && city !== "All" ? { city } : {}).then((r) => r.data.ngos ?? []),
    staleTime: 1000 * 60 * 5,        // 5 min – directory doesn't change often
    placeholderData: [],
  });
}

// ── Public: single NGO profile by id ────────────────────────────
export function useNgoById(id) {
  return useQuery({
    queryKey: NGO_KEYS.detail(id),
    queryFn:  () => getNgoById(id).then((r) => r.data.ngo),
    staleTime: 1000 * 60 * 10,       // 10 min – rarely changes
    enabled:  !!id,
  });
}

// ── Authenticated NGO: their own profile ────────────────────────
export function useMyNgoProfile() {
  return useQuery({
    queryKey: NGO_KEYS.myProfile,
    queryFn:  () => getMyNgoProfile().then((r) => r.data.ngo),
    staleTime: 1000 * 60 * 5,        // 5 min
  });
}

// ── Mutation: update own NGO profile ────────────────────────────
export function useUpdateNgoProfile({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMyNgoProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: NGO_KEYS.myProfile });
      onSuccess?.(data);
    },
    onError,
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDonation, getMyDonations, getMyStats, getNgoDonations } from "../services/api";

// ── Query Keys ── centralised so they never go out of sync ──────
export const DONATION_KEYS = {
  all:       ["donations"],
  myList:    ["donations", "myList"],
  ngos:      ["donations", "ngoList"],
  myStats:   ["donations", "myStats"],
};

// ── Donor: personal stats (totalMeals, totalDonations, etc.) ────
export function useMyStats() {
  return useQuery({
    queryKey: DONATION_KEYS.myStats,
    queryFn: () => getMyStats().then((r) => r.data.stats),
    staleTime: 1000 * 60 * 2,        // 2 min – stats change after a donation
    placeholderData: { totalDonations: 0, totalMeals: 0, deliveredCount: 0, co2Saved: 0 },
  });
}

// ── Donor: list of all their donations ───────────────────────────
export function useMyDonations() {
  return useQuery({
    queryKey: DONATION_KEYS.myList,
    queryFn: () => getMyDonations().then((r) => r.data.donations ?? []),
    staleTime: 1000 * 60 * 2,        // 2 min
    placeholderData: [],
  });
}

// ── NGO: donations assigned to this NGO ──────────────────────────
export function useNgoDonations() {
  return useQuery({
    queryKey: DONATION_KEYS.ngos,
    queryFn: () => getNgoDonations().then((r) => r.data.donations ?? []),
    staleTime: 1000 * 60 * 1,        // 1 min – fresh pickup list matters
    placeholderData: [],
  });
}

// ── Mutation: submit a new donation ─────────────────────────────
export function useCreateDonation({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDonation,
    onSuccess: (data) => {
      // Invalidate both the list and stats so they refresh automatically
      queryClient.invalidateQueries({ queryKey: DONATION_KEYS.myList });
      queryClient.invalidateQueries({ queryKey: DONATION_KEYS.myStats });
      onSuccess?.(data);
    },
    onError,
  });
}

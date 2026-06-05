import { useQuery } from "@tanstack/react-query";
import { getGlobalStats } from "../services/api";

export const STATS_KEYS = {
  global: ["stats", "global"],
};

// ── Platform-wide impact stats ───────────────────────────────────
export function useGlobalStats() {
  return useQuery({
    queryKey: STATS_KEYS.global,
    queryFn:  () => getGlobalStats().then((r) => r.data.stats),
    staleTime: 1000 * 60 * 10,       // 10 min – aggregate numbers don't need to be real-time
    placeholderData: {
      mealsDonated:   0,
      ngoPartners:    0,
      peopleHelped:   0,
      wastePrevented: "0 Kg",
    },
  });
}

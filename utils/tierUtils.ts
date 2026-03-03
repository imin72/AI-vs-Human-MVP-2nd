
import { Tier, UserProfile } from '../types';

export const getTierInfo = (elo: number) => {
  if (elo < 800) return { tier: Tier.UNRANKED, label: "Unranked", color: "text-slate-400", bg: "bg-slate-500", border: "border-slate-500" };
  if (elo < 1000) return { tier: Tier.BRONZE, label: "Bronze", color: "text-orange-700", bg: "bg-orange-700", border: "border-orange-700" };
  if (elo < 1300) return { tier: Tier.SILVER, label: "Silver", color: "text-slate-300", bg: "bg-slate-400", border: "border-slate-400" };
  if (elo < 1600) return { tier: Tier.GOLD, label: "Gold", color: "text-yellow-400", bg: "bg-yellow-500", border: "border-yellow-500" };
  if (elo < 1900) return { tier: Tier.PLATINUM, label: "Platinum", color: "text-cyan-400", bg: "bg-cyan-500", border: "border-cyan-500" };
  if (elo < 2200) return { tier: Tier.DIAMOND, label: "Diamond", color: "text-fuchsia-400", bg: "bg-fuchsia-500", border: "border-fuchsia-500" };
  return { tier: Tier.MASTER, label: "Master", color: "text-rose-500", bg: "bg-rose-600", border: "border-rose-500" };
};

export const calculateAggregateElo = (profile: UserProfile): number => {
  if (!profile.eloRatings) return 1000;
  const values = Object.values(profile.eloRatings);
  if (values.length === 0) return 1000;
  // Simple average for now
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round(sum / values.length);
};

export const getNextTierThreshold = (elo: number) => {
  if (elo < 800) return 800;
  if (elo < 1000) return 1000;
  if (elo < 1300) return 1300;
  if (elo < 1600) return 1600;
  if (elo < 1900) return 1900;
  if (elo < 2200) return 2200;
  return 3000; // Master cap
};

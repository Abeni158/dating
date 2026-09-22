import { prisma } from "@/lib/prisma";

export const DEFAULT_DAILY_DISCOVERY_LIMIT = 10;

export const DISCOVERY_LIMITS = {
  free: 10,
  plus: 20,
  premium: 50,
  elite: 100
} as const;

export function getDailyDiscoveryLimit(planName?: string | null) {
  if (!planName) return DEFAULT_DAILY_DISCOVERY_LIMIT;
  const normalized = planName.toLowerCase();
  return DISCOVERY_LIMITS[normalized as keyof typeof DISCOVERY_LIMITS] ?? DEFAULT_DAILY_DISCOVERY_LIMIT;
}

export function calculateCompatibility(profileA: { interests?: string[]; hobbies?: string[]; travelInterests?: string[]; relationshipGoal?: string | null; lifestylePrefs?: string[]; datingPrefs?: string[] }, profileB: { interests?: string[]; hobbies?: string[]; travelInterests?: string[]; relationshipGoal?: string | null; lifestylePrefs?: string[]; datingPrefs?: string[] }) {
  const sets = {
    interests: (profileA.interests ?? []).filter((value) => (profileB.interests ?? []).includes(value)),
    hobbies: (profileA.hobbies ?? []).filter((value) => (profileB.hobbies ?? []).includes(value)),
    travel: (profileA.travelInterests ?? []).filter((value) => (profileB.travelInterests ?? []).includes(value)),
    lifestyle: (profileA.lifestylePrefs ?? []).filter((value) => (profileB.lifestylePrefs ?? []).includes(value)),
    dating: (profileA.datingPrefs ?? []).filter((value) => (profileB.datingPrefs ?? []).includes(value))
  };

  const score =
    sets.interests.length * 20 +
    sets.hobbies.length * 15 +
    sets.travel.length * 20 +
    sets.lifestyle.length * 15 +
    sets.dating.length * 15 +
    ((profileA.relationshipGoal && profileB.relationshipGoal && profileA.relationshipGoal === profileB.relationshipGoal) ? 20 : 0);

  return {
    score: Math.min(score, 100),
    reasons: [
      ...(sets.interests.length ? ["Shared interests"] : []),
      ...(sets.hobbies.length ? ["Similar hobbies"] : []),
      ...(sets.travel.length ? ["Travel compatibility"] : []),
      ...(sets.lifestyle.length ? ["Lifestyle alignment"] : []),
      ...(profileA.relationshipGoal && profileB.relationshipGoal && profileA.relationshipGoal === profileB.relationshipGoal ? ["Matching relationship goals"] : [])
    ]
  };
}

export async function countDailyInteractions(userId: string) {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const [likes, passes] = await Promise.all([
    prisma.like.count({ where: { senderId: userId, createdAt: { gte: start } } }),
    prisma.pass.count({ where: { senderId: userId, createdAt: { gte: start } } })
  ]);

  return likes + passes;
}

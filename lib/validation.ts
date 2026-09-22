import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1).max(60).optional(),
  displayName: z.string().min(1).max(60).optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  age: z.coerce.number().int().min(18).max(100).optional(),
  occupation: z.string().optional(),
  relationshipGoal: z.string().optional(),
  languages: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  hobbies: z.array(z.string()).optional(),
  travelInterests: z.array(z.string()).optional(),
  lifestylePrefs: z.array(z.string()).optional(),
  datingPrefs: z.array(z.string()).optional(),
  bio: z.string().max(500).optional(),
  profileVisible: z.boolean().optional(),
  openToInternational: z.boolean().optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const profileUpdateSchema = z.object({
  firstName: z.string().min(1).max(60).optional(),
  displayName: z.string().min(1).max(60).optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  bio: z.string().max(500).optional(),
  occupation: z.string().optional(),
  relationshipGoal: z.string().optional(),
  languages: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  hobbies: z.array(z.string()).optional(),
  travelInterests: z.array(z.string()).optional(),
  lifestylePrefs: z.array(z.string()).optional(),
  datingPrefs: z.array(z.string()).optional(),
  profileVisible: z.boolean().optional(),
  openToInternational: z.boolean().optional()
});

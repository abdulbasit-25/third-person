import { z } from "zod";
export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/),
  displayName: z.string().trim().min(2).max(80),
  password: z.string().min(8).max(100),
  status: z.enum(["student", "teacher"]),
});
export const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});
export const reviewSchema = z.object({
  relationship: z.array(z.string()).min(1),
  knownDuration: z.string().min(1),
  interactionFrequency: z.string().min(1),
  ratings: z.record(z.string(), z.number().min(1).max(10)),
  traits: z.array(z.string()),
  answers: z.record(z.string(), z.string()),
  quickChoices: z.record(z.string(), z.string()),
  privateFeedback: z.string().max(5000).default(""),
  finalRating: z.number().min(1).max(10),
  workAgain: z.string(),
  finalSentence: z.string().max(500).default(""),
});

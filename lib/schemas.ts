import { z } from "zod";
import { ratingCategories, traits } from "./constants";

const wordLimitedText = (maxCharacters: number, maxWords: number) =>
  z
    .string()
    .max(maxCharacters)
    .refine(
      (value) => value.trim().split(/\s+/).filter(Boolean).length <= maxWords,
      `Use no more than ${maxWords} words.`,
    );

const answerText = wordLimitedText(4000, 500);
const ratingKey = z.enum(ratingCategories);
const traitValue = z.enum(traits);

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_.@-]+$/),
  displayName: z.string().trim().min(2).max(80),
  password: z.string().min(8).max(100),
  status: z.enum(["student", "teacher"]),
});
export const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});
export const reviewSchema = z
  .object({
    relationship: z
      .array(z.enum(["Classmate", "Friend", "Teammate", "Teacher", "Other"]))
      .min(1)
      .max(5),
    knownDuration: z.enum([
      "a few months",
      "about a year",
      "2 to 4 years",
      "more than 4 years",
    ]),
    interactionFrequency: z.enum([
      "occasionally",
      "weekly",
      "most days",
      "almost every day",
    ]),
    ratings: z.partialRecord(ratingKey, z.number().int().min(1).max(10)),
    traits: z.array(traitValue).max(12),
    answers: z
      .object({
        firstImpression: answerText,
        proudMoment: answerText,
        honestAdvice: answerText,
      })
      .strict(),
    quickChoices: z
      .object({
        energy: z.string().max(80),
        workStyle: z.string().max(80),
      })
      .strict(),
    privateFeedback: wordLimitedText(5000, 600).default(""),
    finalRating: z.number().min(1).max(10),
    workAgain: z.enum(["yes", "maybe", "not yet"]),
    finalSentence: wordLimitedText(1000, 120).trim().min(10),
  })
  .strict();
export const adminResponseSchema = z.object({
  adminResponse: wordLimitedText(5000, 600).trim(),
});

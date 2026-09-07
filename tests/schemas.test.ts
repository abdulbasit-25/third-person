import { describe, expect, it } from "vitest";
import { reviewSchema } from "../lib/schemas";

const validReview = {
  relationship: ["Friend"],
  knownDuration: "about a year",
  interactionFrequency: "weekly",
  ratings: { overall: 8, communication: 7 },
  traits: ["Warm"],
  answers: {
    firstImpression: "",
    proudMoment: "A thoughtful moment.",
    honestAdvice: "",
  },
  quickChoices: { energy: "Steady presence", workStyle: "" },
  privateFeedback: "",
  finalRating: 8,
  workAgain: "yes",
  finalSentence: "Basit is the kind of person who listens carefully.",
};

describe("reviewSchema", () => {
  it("accepts the review shape used by the wizard", () => {
    expect(reviewSchema.safeParse(validReview).success).toBe(true);
  });

  it("rejects unknown fields and rating keys", () => {
    expect(
      reviewSchema.safeParse({ ...validReview, unexpected: "value" }).success,
    ).toBe(false);
    expect(
      reviewSchema.safeParse({
        ...validReview,
        ratings: { ...validReview.ratings, unknown: 5 },
      }).success,
    ).toBe(false);
  });

  it("rejects invalid final sentences and oversized answers", () => {
    expect(
      reviewSchema.safeParse({ ...validReview, finalSentence: "Too short" })
        .success,
    ).toBe(false);
    expect(
      reviewSchema.safeParse({
        ...validReview,
        answers: {
          ...validReview.answers,
          proudMoment: Array(501).fill("word").join(" "),
        },
      }).success,
    ).toBe(false);
  });
});

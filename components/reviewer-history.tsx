"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ReviewResponseForm } from "@/components/review-response-form";

type SerializedReview = {
  id: string;
  finalRating: number | string;
  ratings: Record<string, number>;
  finalSentence: string;
  answers: Record<string, unknown>;
  traits: string[];
  adminResponse: string | null;
  version: number;
  isCurrent: boolean;
  createdAt: string;
};

const ANSWER_LABELS: Record<string, string> = {
  firstImpression: "First Impression",
  proudMoment: "Proud Moment",
  honestAdvice: "Honest Advice",
};

function ratingLabel(key: string) {
  return key.replace(/([A-Z])/g, " $1");
}

function ratingColor(value: number | string) {
  const score = Number(value);
  if (score <= 4) return "text-red-700";
  if (score <= 7) return "text-amber-700";
  return "text-emerald-700";
}

function RatingSummary({ ratings }: { ratings: Record<string, number> }) {
  const entries = Object.entries(ratings).filter(
    ([key, value]) => key !== "overall" && Number.isFinite(Number(value)),
  );
  if (!entries.length) return null;

  return (
    <div className="mt-8 grid gap-3 border-y hairline py-6 sm:grid-cols-2">
      {entries.map(([key, value]) => (
        <div className="flex items-center justify-between gap-4" key={key}>
          <span className="text-xs uppercase tracking-[.1em] text-[var(--muted)]">
            {ratingLabel(key)}
          </span>
          <strong
            className={`display text-2xl tabular-nums ${ratingColor(value)}`}
          >
            {value}/10
          </strong>
        </div>
      ))}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ReviewerHistory({
  reviewerName,
  reviewerStatus,
  latest,
  history,
}: {
  reviewerName: string;
  reviewerStatus: string;
  latest: SerializedReview;
  history: SerializedReview[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="icon-action flex w-full items-center justify-between gap-4 py-7 text-left"
      >
        <div>
          <p className="display text-2xl sm:text-3xl">{reviewerName}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <p className="eyebrow">{reviewerStatus}</p>
            {history.length ? (
              <span className="eyebrow border hairline px-2 py-1 text-[var(--muted)]">
                {history.length + 1} versions
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <p className="display text-3xl tabular-nums sm:text-4xl">
            <span className="text-[var(--accent)]">{latest.finalRating}</span>
            <span className="text-base text-[var(--muted)]">/10</span>
          </p>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-[var(--muted)] transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
            strokeWidth={1.5}
          />
        </div>
      </button>

      {open ? (
        <div className="border-t hairline pb-10 pt-8">
          {/* Latest review — the review starts here */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="eyebrow border border-[var(--accent)] px-2 py-1 text-[var(--accent)]">
                Latest — {formatDate(latest.createdAt)}
              </span>
              <strong
                className={`display text-4xl tabular-nums ${ratingColor(latest.finalRating)}`}
              >
                {latest.finalRating}/10
              </strong>
            </div>
            <p className="mt-6 max-w-3xl font-serif text-xl leading-relaxed sm:text-2xl">
              {latest.finalSentence || "No final sentence was added."}
            </p>
            <RatingSummary ratings={latest.ratings} />
            <div className="mt-8 grid gap-5 border-b hairline pb-6">
              {Object.entries(latest.answers || {})
                .filter(([, value]) => value)
                .map(([key, value]) => (
                  <div key={key}>
                    <p className="font-bold text-xs uppercase tracking-[.14em] text-[var(--accent)]">
                      {ANSWER_LABELS[key] ?? key.replace(/([A-Z])/g, " $1")}
                    </p>
                    <p className="max-w-3xl whitespace-pre-wrap break-words font-serif text-lg leading-relaxed text-[var(--muted)]">
                      {String(value)}
                    </p>
                  </div>
                ))}
            </div>
            {latest.traits?.length ? (
              <p className="mt-5 text-xs uppercase tracking-[.12em] text-[var(--accent)]">
                {latest.traits.join(" / ")}
              </p>
            ) : null}
            {latest.isCurrent ? (
              <ReviewResponseForm
                reviewId={latest.id}
                initialResponse={latest.adminResponse ?? undefined}
              />
            ) : null}
          </div>

          {/* Earlier versions */}
          {history.length ? (
            <div className="mt-10 border-t hairline pt-8">
              <p className="eyebrow mb-6 text-[var(--muted)]">
                Earlier versions
              </p>
              <div className="space-y-8">
                {history.map((review) => (
                  <div key={review.id} className="border-l-2 hairline pl-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-bold text-sm">
                        Version {review.version}
                      </span>
                      <span className="eyebrow text-[var(--muted)]">
                        {formatDate(review.createdAt)}
                      </span>
                      <span
                        className={`text-sm font-bold tabular-nums ${ratingColor(review.finalRating)}`}
                      >
                        {review.finalRating}/10
                      </span>
                    </div>
                    <p className="mt-3 max-w-3xl font-serif text-base leading-relaxed text-[var(--muted)]">
                      {review.finalSentence || "No final sentence was added."}
                    </p>
                    <RatingSummary ratings={review.ratings} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

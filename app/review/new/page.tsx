"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { ratingCategories, traits } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const wordCount = (value: string) =>
  value.trim().split(/\s+/).filter(Boolean).length;

const micro = "text-[9px] font-medium uppercase tracking-[0.22em]";

function FooterBackButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="
    group relative
    inline-flex items-center gap-2
    rounded-md
    px-3 py-2
    text-sm font-medium
    text-gray-600
    transition-colors duration-200
    hover:text-gray-900
    disabled:cursor-not-allowed
    disabled:opacity-30
  "
    >
      <span aria-hidden="true">←</span>
      <span className="relative">
        Back
        <span
          className="
        absolute
        bottom-0 left-0
        h-[1.5px] w-full
        origin-left
        scale-x-0
        bg-gray-900
        transition-transform duration-300 ease-out
        group-hover:scale-x-100
      "
        />
      </span>
    </button>
  );
}

function FooterActionButton({
  onClick,
  disabled,
  label,
  loadingLabel,
  loading,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  loadingLabel?: string;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`review-nav-action action-button action-button--accent inline-flex items-center gap-3 ${micro} disabled:opacity-60 ${loading ? "cursor-wait" : ""}`}
    >
      <span>{loading ? (loadingLabel ?? "Saving...") : label}</span>
      <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />
    </button>
  );
}

const steps = [
  "The context",
  "The texture",
  "The character",
  "The moment",
  "The honest bit",
  "The instinct",
];

// Stamped-badge toggle. Uses INLINE styles on purpose: inline `style` wins
// over any class-based CSS regardless of specificity, so this will render
// correctly even if something elsewhere in the stylesheet (a button reset,
// a conflicting utility, a CSS-variable format mismatch) was cancelling the
// class-based border/background before. Literal colors, not var(--x)/NN,
// so there's nothing left that can silently fail.
function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 16px",
        fontSize: "11px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontFamily: "inherit",
        borderRadius: "3px",
        border: active ? "1.5px solid #b5541c" : "1.5px solid #cdc4b2",
        backgroundColor: active ? "#c1611f" : "#f6f1e7",
        color: active ? "#fff8ef" : "#6b6252",
        boxShadow: active ? "0 2px 6px rgba(180,84,28,0.35)" : "none",
        cursor: "pointer",
        transition: "all 150ms ease",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = "#3a352b";
          e.currentTarget.style.color = "#3a352b";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = "#cdc4b2";
          e.currentTarget.style.color = "#6b6252";
        }
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "14px",
          height: "14px",
          borderRadius: "2px",
          border: active ? "1.5px solid #fff8ef" : "1.5px solid #b3a894",
          backgroundColor: active ? "#fff8ef" : "transparent",
          flexShrink: 0,
        }}
      >
        {active && (
          <svg
            width="9"
            height="9"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c1611f"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      {children}
    </button>
  );
}

export default function NewReviewPage() {
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [relationship, setRelationship] = useState<string[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [knownDuration, setKnownDuration] = useState("a few months");
  const [interactionFrequency, setInteractionFrequency] =
    useState("occasionally");
  const [ratings, setRatings] = useState<Record<string, number>>({
    overall: 8,
  });
  const [answers, setAnswers] = useState<Record<string, string>>({
    firstImpression: "",
    proudMoment: "",
    honestAdvice: "",
  });
  const [quickChoices, setQuickChoices] = useState<Record<string, string>>({
    energy: "",
    workStyle: "",
  });
  const [finalRating, setFinalRating] = useState(8);
  const [workAgain, setWorkAgain] = useState("yes");
  const [finalSentence, setFinalSentence] = useState("");
  const max = 6;

  if (sent)
    return (
      <main className="mirror-grid min-h-screen px-6 py-10 md:px-10">
        <Header
          variant="reviewer-sub"
          backHref="/review/intro"
          backLabel="Reviewer space"
          rightContent={
            <Link
              href="/api/auth/logout"
              className="eyebrow text-[var(--accent)]"
            >
              Sign out
            </Link>
          }
        />
        <div className="mx-auto max-w-3xl py-24">
          <p className="eyebrow text-[var(--accent)]">Review saved</p>
          <h1 className="display mt-6 text-8xl leading-[.88]">
            That was
            <br />
            <i>worth saying.</i>
          </h1>
          <p className="mt-10 max-w-md font-serif text-2xl leading-relaxed text-[var(--muted)]">
            Thank you for giving this the time it deserved. You can return and
            update your perspective whenever it changes.
          </p>
          <Link
            href="/review/intro"
            className="mt-10 inline-block border border-[var(--ink)] px-6 py-4 text-[11px] uppercase tracking-[.14em] transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)]"
          >
            Return to your space ↗
          </Link>
        </div>
      </main>
    );

  async function submit() {
    if (finalSentence.trim().length < 10) {
      setError("Add a final sentence of at least 10 characters.");
      return;
    }
    setSubmitting(true);
    setError("");
    const payload = {
      relationship,
      knownDuration,
      interactionFrequency,
      ratings,
      traits: selectedTraits,
      answers,
      quickChoices,
      privateFeedback: "",
      finalRating,
      workAgain,
      finalSentence,
    };
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) setSent(true);
      else setError("Your review could not be saved. Please try again.");
    } catch {
      setError("The server could not be reached. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function nextStep() {
    if (step === 1 && relationship.length === 0) {
      setError("Choose at least one relationship before continuing.");
      return;
    }
    setError("");
    setStep(step + 1);
  }

  return (
    <main className="mirror-grid min-h-screen px-6 py-8 md:px-10">
      <Header
        variant="reviewer-sub"
        backHref="/review/intro"
        backLabel="Reviewer space"
        rightContent={
          <div className="flex items-center gap-5">
            <span className="eyebrow text-[var(--accent)]">
              0{step} / 0{max}
            </span>
            <Link href="/api/auth/logout" className="eyebrow">
              Sign out
            </Link>
          </div>
        }
      />

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 pb-32 pt-16 md:grid-cols-[3rem_1fr]">
        {/* Vertical step index — desktop only */}
        <nav className="hidden flex-col gap-5 md:flex">
          {steps.map((label, index) => {
            const n = index + 1;
            const active = n === step;
            const done = n < step;
            return (
              <button
                key={label}
                type="button"
                disabled={n > step}
                onClick={() => n < step && setStep(n)}
                className="group flex items-baseline gap-2 text-left disabled:cursor-default"
                title={label}
              >
                <span
                  className={[
                    "font-serif text-sm tabular-nums transition-colors",
                    active
                      ? "text-[var(--accent)]"
                      : done
                        ? "text-[var(--ink)]"
                        : "text-[var(--ink)]/20",
                  ].join(" ")}
                >
                  {String(n).padStart(2, "0")}
                </span>
                <span
                  className={[
                    "h-px flex-1 self-center transition-colors",
                    active || done
                      ? "bg-[var(--ink)]/40"
                      : "bg-[var(--ink)]/10",
                  ].join(" ")}
                />
              </button>
            );
          })}
        </nav>

        <div>
          <p className="eyebrow mb-6 flex items-baseline gap-3 text-[var(--accent)]">
            <span className="font-serif text-sm text-[var(--ink)]/30">
              {String(step).padStart(2, "0")} —
            </span>
            {steps[step - 1]}
          </p>

          {step === 1 && (
            <div className="space-y-12">
              <h1 className="display text-6xl leading-[.9] md:text-7xl">
                How do you
                <br />
                <i>know Basit?</i>
              </h1>

              <div className="flex flex-wrap gap-2.5">
                {["Classmate", "Friend", "Teammate", "Teacher", "Other"].map(
                  (item) => (
                    <ChoiceButton
                      key={item}
                      active={relationship.includes(item)}
                      onClick={() =>
                        setRelationship((current) =>
                          current.includes(item)
                            ? current.filter((value) => value !== item)
                            : [...current, item],
                        )
                      }
                    >
                      {item}
                    </ChoiceButton>
                  ),
                )}
              </div>

              <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
                <label className="block border-b hairline pb-3">
                  <span className="eyebrow mb-3 block">
                    How long have you known him?
                  </span>
                  <select
                    value={knownDuration}
                    onChange={(event) => setKnownDuration(event.target.value)}
                    className="w-full bg-transparent py-2 text-lg outline-none"
                  >
                    <option>a few months</option>
                    <option>about a year</option>
                    <option>2 to 4 years</option>
                    <option>more than 4 years</option>
                  </select>
                </label>
                <label className="block border-b hairline pb-3">
                  <span className="eyebrow mb-3 block">
                    How often do you interact?
                  </span>
                  <select
                    value={interactionFrequency}
                    onChange={(event) =>
                      setInteractionFrequency(event.target.value)
                    }
                    className="w-full bg-transparent py-2 text-lg outline-none"
                  >
                    <option>occasionally</option>
                    <option>weekly</option>
                    <option>most days</option>
                    <option>almost every day</option>
                  </select>
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10">
              <h1 className="display text-6xl leading-[.9] md:text-7xl">
                What comes
                <br />
                <i>to mind first?</i>
              </h1>

              <div className="divide-y hairline border-t hairline">
                {ratingCategories
                  .filter((category) => category !== "overall")
                  .slice(0, 6)
                  .map((category) => {
                    const value = ratings[category] || 7;
                    return (
                      <div
                        key={category}
                        className="grid grid-cols-[8rem_1fr_2rem] items-center gap-4 py-4 sm:grid-cols-[10rem_1fr_2.5rem]"
                      >
                        <span className="text-xs uppercase tracking-[.12em] text-[var(--muted)]">
                          {category.replace(/([A-Z])/g, " $1")}
                        </span>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={value}
                          onChange={(event) =>
                            setRatings({
                              ...ratings,
                              [category]: Number(event.target.value),
                            })
                          }
                          className="w-full accent-[var(--accent)]"
                        />
                        <strong className="display text-right text-lg">
                          {value}
                        </strong>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <h1 className="display text-6xl leading-[.9] md:text-7xl">
                What kind of
                <br />
                <i>person is he?</i>
              </h1>
              <p className="max-w-lg font-serif text-xl text-[var(--muted)]">
                Choose the words that feel earned. You can pick as many as you
                need.
              </p>
              <div className="flex flex-wrap gap-2.5 pt-4">
                {traits.map((trait) => (
                  <ChoiceButton
                    key={trait}
                    active={selectedTraits.includes(trait)}
                    onClick={() =>
                      setSelectedTraits((current) =>
                        current.includes(trait)
                          ? current.filter((value) => value !== trait)
                          : [...current, trait],
                      )
                    }
                  >
                    {trait}
                  </ChoiceButton>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-10">
              <div className="space-y-4">
                <h1 className="display text-6xl leading-[.9] md:text-7xl">
                  Give me a
                  <br />
                  <i>real moment.</i>
                </h1>
                <p className="max-w-lg font-serif text-xl text-[var(--muted)]">
                  What is something he did, said, or made that stayed with you?
                </p>
              </div>

              <div>
                <textarea
                  value={answers.firstImpression || ""}
                  onChange={(event) =>
                    setAnswers({
                      ...answers,
                      firstImpression: event.target.value,
                    })
                  }
                  maxLength={4000}
                  className="min-h-36 w-full resize-y border hairline bg-transparent p-4 font-serif text-xl outline-none focus:border-[var(--accent)]"
                  placeholder="What did you notice first?"
                />
                <p className="mt-2 text-right text-[10px] text-[var(--muted)]">
                  {wordCount(answers.firstImpression || "")} words /{" "}
                  {(answers.firstImpression || "").length} characters (maximum
                  500 words / 4000 characters)
                </p>
              </div>

              <div>
                <textarea
                  value={answers.proudMoment || ""}
                  onChange={(event) =>
                    setAnswers({ ...answers, proudMoment: event.target.value })
                  }
                  maxLength={4000}
                  className="min-h-48 w-full resize-none border hairline bg-transparent p-4 font-serif text-2xl outline-none focus:border-[var(--accent)]"
                  placeholder="A moment worth remembering..."
                />
                <p className="mt-2 text-right text-[10px] text-[var(--muted)]">
                  {wordCount(answers.proudMoment || "")} words /{" "}
                  {(answers.proudMoment || "").length} characters (maximum 500
                  words / 4000 characters)
                </p>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-10">
              <h1 className="display text-6xl leading-[.9] md:text-7xl">
                The useful
                <br />
                <i>truth.</i>
              </h1>

              <div>
                <p className="eyebrow mb-4">His energy in a room</p>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    "Quiet gravity",
                    "Bright chaos",
                    "Steady presence",
                    "Depends on the day",
                  ].map((choice) => (
                    <ChoiceButton
                      key={choice}
                      active={quickChoices.energy === choice}
                      onClick={() =>
                        setQuickChoices({ ...quickChoices, energy: choice })
                      }
                    >
                      {choice}
                    </ChoiceButton>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="eyebrow mb-3 block">
                  What honest advice would you give him?
                </span>
                <textarea
                  value={answers.honestAdvice || ""}
                  onChange={(event) =>
                    setAnswers({ ...answers, honestAdvice: event.target.value })
                  }
                  maxLength={4000}
                  className="min-h-36 w-full resize-none border hairline bg-transparent p-4 font-serif text-xl outline-none focus:border-[var(--accent)]"
                  placeholder="The thing I hope you remember..."
                />
                <p className="mt-2 text-right text-[10px] text-[var(--muted)]">
                  {wordCount(answers.honestAdvice || "")} words /{" "}
                  {(answers.honestAdvice || "").length} characters (maximum 500
                  words / 4000 characters)
                </p>
              </label>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-10">
              <h1 className="display text-6xl leading-[.9] md:text-7xl">
                One last
                <br />
                <i>instinct.</i>
              </h1>

              <div>
                <span className="eyebrow mb-4 block">
                  Would you work with him again?
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {["yes", "maybe", "not yet"].map((choice) => (
                    <ChoiceButton
                      key={choice}
                      active={workAgain === choice}
                      onClick={() => setWorkAgain(choice)}
                    >
                      {choice}
                    </ChoiceButton>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="eyebrow mb-3 block">Your final sentence</span>
                <textarea
                  value={finalSentence}
                  onChange={(event) => setFinalSentence(event.target.value)}
                  maxLength={1000}
                  className="min-h-32 w-full resize-none border hairline bg-transparent p-4 font-serif text-2xl outline-none focus:border-[var(--accent)]"
                  placeholder="Basit is the kind of person who..."
                />
                <p className="mt-2 text-right text-[10px] text-[var(--muted)]">
                  {wordCount(finalSentence)} words / {finalSentence.length}{" "}
                  characters (minimum 10 characters, maximum 120 words / 1000
                  characters)
                </p>
              </label>

              <label className="block">
                <div className="flex items-baseline justify-between">
                  <span className="eyebrow">Overall feeling</span>
                  <strong className="display text-4xl">{finalRating}/10</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={finalRating}
                  onChange={(event) =>
                    setFinalRating(Number(event.target.value))
                  }
                  className="mt-4 w-full accent-[var(--accent)]"
                />
              </label>
            </div>
          )}

          {error && (
            <p className="mt-8 border-l-2 border-[var(--accent)] px-3 text-xs text-[var(--accent)]">
              {error}
            </p>
          )}
        </div>
      </div>

      <footer className="review-nav-footer fixed bottom-0 left-0 right-0 px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <FooterBackButton
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
          />
          {step < max ? (
            <FooterActionButton onClick={nextStep} label="Next" />
          ) : (
            <FooterActionButton
              onClick={submit}
              disabled={submitting}
              loading={submitting}
              label="Send it to Basit"
              loadingLabel="Saving..."
            />
          )}
        </div>
      </footer>
      {/* <Footer /> */}
    </main>
  );
}

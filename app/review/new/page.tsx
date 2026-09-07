"use client";
import Link from "next/link";
import { useState } from "react";
import { ratingCategories, traits } from "@/lib/constants";

const wordCount = (value: string) =>
  value.trim().split(/\s+/).filter(Boolean).length;

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
        <header className="flex justify-between border-b hairline pb-5">
          <Link href="/review/intro" className="eyebrow">
            ← Reviewer space
          </Link>
          <Link
            href="/api/auth/logout"
            className="eyebrow text-[var(--accent)]"
          >
            Sign out
          </Link>
        </header>
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
      <header className="flex justify-between border-b hairline pb-5">
        <Link href="/review/intro" className="eyebrow">
          ← Reviewer space
        </Link>
        <div className="flex items-center gap-5">
          <span className="eyebrow text-[var(--accent)]">
            0{step} / 0{max}
          </span>
          <Link href="/api/auth/logout" className="eyebrow">
            Sign out
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-3xl pb-32 pt-20">
        <p className="eyebrow mb-6">
          {step === 1
            ? "The context"
            : step === 2
              ? "The texture"
              : "The honest bit"}
        </p>
        {step === 1 && (
          <>
            <h1 className="display text-7xl leading-[.9]">
              How do you
              <br />
              <i>know Basit?</i>
            </h1>
            <div className="mt-12 flex flex-wrap gap-3">
              {["Classmate", "Friend", "Teammate", "Teacher", "Other"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() =>
                      setRelationship((current) =>
                        current.includes(item)
                          ? current.filter((value) => value !== item)
                          : [...current, item],
                      )
                    }
                    className={`border px-5 py-3 text-xs ${relationship.includes(item) ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "hairline"}`}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <label className="border-b hairline pb-3">
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
              <label className="border-b hairline pb-3">
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
          </>
        )}
        {step === 2 && (
          <>
            <h1 className="display text-7xl leading-[.9]">
              What comes
              <br />
              <i>to mind first?</i>
            </h1>
            <div className="mt-12 grid gap-5">
              {ratingCategories
                .filter((category) => category !== "overall")
                .slice(0, 6)
                .map((category) => (
                  <label
                    className="grid grid-cols-[1fr_7rem] items-center gap-5 border-b hairline pb-3"
                    key={category}
                  >
                    <span className="text-xs uppercase tracking-[.12em]">
                      {category.replace(/([A-Z])/g, " $1")}
                    </span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={ratings[category] || 7}
                      onChange={(event) =>
                        setRatings({
                          ...ratings,
                          [category]: Number(event.target.value),
                        })
                      }
                    />
                  </label>
                ))}
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h1 className="display text-7xl leading-[.9]">
              What kind of
              <br />
              <i>person is he?</i>
            </h1>
            <p className="mt-8 max-w-lg font-serif text-xl text-[var(--muted)]">
              Choose the words that feel earned. You can pick as many as you
              need.
            </p>
            <div className="mt-12 flex flex-wrap gap-3">
              {traits.map((trait) => (
                <button
                  key={trait}
                  onClick={() =>
                    setSelectedTraits((current) =>
                      current.includes(trait)
                        ? current.filter((value) => value !== trait)
                        : [...current, trait],
                    )
                  }
                  className={`border px-5 py-3 text-xs ${selectedTraits.includes(trait) ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "hairline"}`}
                >
                  {trait}
                </button>
              ))}
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <h1 className="display text-7xl leading-[.9]">
              Give me a
              <br />
              <i>real moment.</i>
            </h1>
            <p className="mt-8 max-w-lg font-serif text-xl text-[var(--muted)]">
              What is something he did, said, or made that stayed with you?
            </p>
            <textarea
              value={answers.firstImpression || ""}
              onChange={(event) =>
                setAnswers({ ...answers, firstImpression: event.target.value })
              }
              maxLength={4000}
              className="mt-10 min-h-36 w-full resize-y border hairline bg-transparent p-4 font-serif text-xl outline-none focus:border-[var(--accent)]"
              placeholder="What did you notice first?"
            />
            <p className="mt-2 text-right text-[10px] text-[var(--muted)]">
              {wordCount(answers.firstImpression || "")} words /{" "}
              {(answers.firstImpression || "").length} characters (maximum 500
              words / 4000 characters)
            </p>
            <textarea
              value={answers.proudMoment || ""}
              onChange={(event) =>
                setAnswers({ ...answers, proudMoment: event.target.value })
              }
              maxLength={4000}
              className="mt-10 min-h-48 w-full resize-none border hairline bg-transparent p-4 font-serif text-2xl outline-none focus:border-[var(--accent)]"
              placeholder="A moment worth remembering..."
            />
            <p className="mt-2 text-right text-[10px] text-[var(--muted)]">
              {wordCount(answers.proudMoment || "")} words /{" "}
              {(answers.proudMoment || "").length} characters (maximum 500 words
              / 4000 characters)
            </p>
          </>
        )}
        {step === 5 && (
          <>
            <h1 className="display text-7xl leading-[.9]">
              The useful
              <br />
              <i>truth.</i>
            </h1>
            <div className="mt-10 grid gap-8">
              <div>
                <p className="eyebrow mb-4">His energy in a room</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Quiet gravity",
                    "Bright chaos",
                    "Steady presence",
                    "Depends on the day",
                  ].map((choice) => (
                    <button
                      key={choice}
                      onClick={() =>
                        setQuickChoices({ ...quickChoices, energy: choice })
                      }
                      className={`border px-4 py-3 text-xs ${quickChoices.energy === choice ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "hairline"}`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </div>
              <label>
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
          </>
        )}
        {step === 6 && (
          <>
            <h1 className="display text-7xl leading-[.9]">
              One last
              <br />
              <i>instinct.</i>
            </h1>
            <label className="mt-12 block">
              <span className="eyebrow">Would you work with him again?</span>
              <div className="mt-4 flex gap-3">
                {["yes", "maybe", "not yet"].map((choice) => (
                  <button
                    key={choice}
                    onClick={() => setWorkAgain(choice)}
                    className={`border px-5 py-3 text-xs ${workAgain === choice ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "hairline"}`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </label>
            <label className="mt-10 block">
              <span className="eyebrow">Your final sentence</span>
              <textarea
                value={finalSentence}
                onChange={(event) => setFinalSentence(event.target.value)}
                maxLength={1000}
                className="mt-3 min-h-32 w-full resize-none border hairline bg-transparent p-4 font-serif text-2xl outline-none focus:border-[var(--accent)]"
                placeholder="Basit is the kind of person who..."
              />
              <p className="mt-2 text-right text-[10px] text-[var(--muted)]">
                {wordCount(finalSentence)} words / {finalSentence.length}{" "}
                characters (minimum 10 characters, maximum 120 words / 1000
                characters)
              </p>
            </label>
            <label className="mt-10 block">
              <div className="flex justify-between">
                <span className="eyebrow">Overall feeling</span>
                <strong className="display text-4xl">{finalRating}/10</strong>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={finalRating}
                onChange={(event) => setFinalRating(Number(event.target.value))}
                className="mt-4 w-full"
              />
            </label>
          </>
        )}
        {error && (
          <p className="mt-8 border-l-2 border-[var(--accent)] px-3 text-xs text-[var(--accent)]">
            {error}
          </p>
        )}
      </div>
      <footer className="fixed bottom-0 left-0 right-0 border-t hairline bg-[var(--paper)]/95 px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-3xl justify-between">
          <button
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="eyebrow disabled:opacity-30"
          >
            ← Back
          </button>
          {step < max ? (
            <button
              type="button"
              onClick={nextStep}
              className="bg-[var(--ink)] px-6 py-3 text-[11px] uppercase tracking-[.14em] text-[var(--paper)]"
            >
              Next ↗
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="bg-[var(--accent)] px-6 py-3 text-[11px] uppercase tracking-[.14em] text-white"
            >
              {submitting ? "Saving..." : "Send it to Basit ↗"}
            </button>
          )}
        </div>
      </footer>
    </main>
  );
}

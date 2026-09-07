"use client";
import { useState } from "react";
import { ratingCategories } from "@/lib/constants";
export default function NewReviewPage() {
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({
    overall: 8,
  });
  const [message, setMessage] = useState("");
  const max = 6;
  if (sent)
    return (
      <main className="mirror-grid min-h-screen px-6 py-10 md:px-10">
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
        </div>
      </main>
    );
  async function submit() {
    const payload = {
      relationship: ["friend"],
      knownDuration: "2 years",
      interactionFrequency: "weekly",
      ratings,
      traits: selected,
      answers: { honestAdvice: message },
      quickChoices: {},
      privateFeedback: "",
      finalRating: ratings.overall || 8,
      workAgain: "yes",
      finalSentence: message,
    };
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (response.ok) setSent(true);
  }
  return (
    <main className="mirror-grid min-h-screen px-6 py-8 md:px-10">
      <header className="flex justify-between border-b hairline pb-5">
        <span className="eyebrow">ABDUL BASIT — BSAI&apos;24, SZABIST</span>
        <span className="eyebrow text-[var(--accent)]">
          0{step} / 0{max}
        </span>
      </header>
      <div className="mx-auto max-w-3xl py-20">
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
                    onClick={() => setSelected([item])}
                    className={`border px-5 py-3 text-xs ${selected.includes(item) ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "hairline"}`}
                  >
                    {item}
                  </button>
                ),
              )}
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
              {ratingCategories.slice(0, 6).map((category) => (
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
        {step >= 3 && (
          <>
            <h1 className="display text-7xl leading-[.9]">
              The honest
              <br />
              <i>bit.</i>
            </h1>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={1200}
              className="mt-12 min-h-48 w-full resize-none border hairline bg-transparent p-4 font-serif text-2xl outline-none focus:border-[var(--accent)]"
              placeholder="What would you want Basit to know?"
            />
            <p className="mt-2 text-right text-[10px] text-[var(--muted)]">
              {message.length} / 1200
            </p>
          </>
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
              onClick={() => setStep(step + 1)}
              className="bg-[var(--ink)] px-6 py-3 text-[11px] uppercase tracking-[.14em] text-[var(--paper)]"
            >
              Next ↗
            </button>
          ) : (
            <button
              onClick={submit}
              className="bg-[var(--accent)] px-6 py-3 text-[11px] uppercase tracking-[.14em] text-white"
            >
              Send it to Basit ↗
            </button>
          )}
        </div>
      </footer>
    </main>
  );
}

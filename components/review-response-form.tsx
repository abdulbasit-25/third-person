"use client";

import { useState } from "react";

export function ReviewResponseForm({
  reviewId,
  initialResponse,
}: {
  reviewId: string;
  initialResponse?: string;
}) {
  const [response, setResponse] = useState(initialResponse || "");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setStatus("");
    try {
      const result = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminResponse: response }),
      });
      const body = await result.json();
      setStatus(result.ok ? "Response saved." : body.error);
    } catch {
      setStatus("The server could not be reached.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-6 border-t hairline pt-5">
      <label className="eyebrow block" htmlFor={`response-${reviewId}`}>
        Your response
      </label>
      <textarea
        id={`response-${reviewId}`}
        value={response}
        onChange={(event) => setResponse(event.target.value)}
        maxLength={5000}
        className="mt-3 min-h-28 w-full resize-y border hairline bg-transparent p-3 font-serif text-lg outline-none focus:border-[var(--accent)]"
        placeholder="Write a thoughtful response..."
      />
      <div className="mt-3 flex items-center justify-between gap-4">
        <span className="text-xs text-[var(--muted)]">{status}</span>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="action-button px-5 py-3 text-[11px] uppercase tracking-[.14em] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save response ↗"}
        </button>
      </div>
    </div>
  );
}

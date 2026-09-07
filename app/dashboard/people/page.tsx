import Link from "next/link";
import { getDb } from "@/lib/mongodb";
import { Header } from "@/components/layout/Header";

export default async function PeoplePage() {
  const people = await (
    await getDb()
  )
    .collection("user")
    .find({ role: "reviewer" }, { projection: { passwordHash: 0 } })
    .sort({ createdAt: -1 })
    .toArray();

  return (
    <main className="mirror-grid min-h-screen px-6 py-8 md:px-10">
      <Header variant="dashboard-detail" />
      <section className="mx-auto max-w-5xl py-20">
        <p className="eyebrow mb-5 text-[var(--accent)]">Archive / people</p>
        <h1 className="display text-7xl leading-[.88]">
          The people
          <br />
          <i>behind the words.</i>
        </h1>
        <p className="mt-8 max-w-xl font-serif text-xl leading-relaxed text-[var(--muted)]">
          Reviewers are part of the archive too: each perspective has a person,
          a history, and a reason for being here.
        </p>
        <div className="mt-16 divide-y hairline">
          {people.length ? (
            people.map((person) => (
              <article
                className="flex flex-col justify-between gap-4 py-7 md:flex-row md:items-center"
                key={person._id.toString()}
              >
                <div>
                  <Link
                    href={`/dashboard/people/${person._id.toString()}`}
                    className="display text-3xl transition-colors hover:text-[var(--accent)]"
                  >
                    {person.displayName}
                  </Link>
                  <p className="eyebrow mt-2">{person.username}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="eyebrow">Perspective from</p>
                  <p className="font-serif text-lg">
                    {person.status || "reviewer"}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <p className="py-12 font-serif text-2xl text-[var(--muted)]">
              No reviewers have joined yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

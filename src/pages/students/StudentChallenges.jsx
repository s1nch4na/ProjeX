import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getChallenges } from "../../utils/api";

function formatDate(value) {
  return value
    ? new Date(value).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Date unavailable";
}

export default function StudentChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getChallenges()
      .then((items) => {
        if (!cancelled) setChallenges(items || []);
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError.message || "Could not load challenges.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = useMemo(
    () => challenges.find((challenge) => challenge.status === "Active") || challenges[0],
    [challenges]
  );
  const groups = [
    ["Active", challenges.filter((challenge) => challenge.status === "Active")],
    ["Upcoming", challenges.filter((challenge) => challenge.status === "Upcoming")],
    ["Past", challenges.filter((challenge) => challenge.status === "Closed")],
  ];

  if (loading) {
    return <div className="p-8 text-sm uppercase tracking-widest text-neutral-500">Loading challenges...</div>;
  }

  if (error) {
    return <div className="border border-black bg-white p-8 text-sm text-red-700">{error}</div>;
  }

  return (
    <div className="space-y-10">
      <header className="border-b border-black pb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">ProJeX community</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">Weekly Challenges</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
          Build something real, share your process, and put your work in front
          of the ProJeX community.
        </p>
      </header>

      {featured ? (
        <Link
          to={`/challenges/${featured.id}`}
          className="group block overflow-hidden border border-black bg-black text-white"
        >
          <div className="grid md:grid-cols-[1.4fr_1fr]">
            <div className="min-h-64 p-7 md:p-10">
              <span className="rounded-full bg-white px-3 py-1 text-[10px] uppercase tracking-widest text-black">
                Current challenge
              </span>
              <h3 className="mt-8 text-3xl font-semibold tracking-tight md:text-5xl">{featured.title}</h3>
              <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-300">{featured.summary || featured.description}</p>
              <p className="mt-8 text-xs uppercase tracking-widest text-neutral-400">
                Deadline · {formatDate(featured.deadline_at)}
              </p>
            </div>
            <div
              className="flex min-h-64 items-end bg-neutral-800 bg-cover bg-center p-7 md:p-10"
              style={featured.cover_image_url ? { backgroundImage: `url(${featured.cover_image_url})` } : undefined}
            >
              <span className="text-sm uppercase tracking-widest group-hover:underline">View challenge →</span>
            </div>
          </div>
        </Link>
      ) : (
        <div className="border border-black bg-white p-10 text-center text-sm text-neutral-500">
          No challenges have been published yet.
        </div>
      )}

      {groups.map(([label, items]) => (
        <section key={label}>
          <div className="mb-4 flex items-end justify-between border-b border-neutral-300 pb-3">
            <h3 className="text-xl font-semibold">{label} challenges</h3>
            <span className="text-xs uppercase tracking-widest text-neutral-500">{items.length}</span>
          </div>
          {items.length === 0 ? (
            <p className="py-5 text-sm text-neutral-500">No {label.toLowerCase()} challenges right now.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((challenge) => (
                <Link key={challenge.id} to={`/challenges/${challenge.id}`} className="rounded-xl border border-neutral-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-black">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500">{challenge.category || "Community"}</span>
                    <span className="rounded-full bg-neutral-100 px-2 py-1 text-[10px] uppercase">{challenge.status}</span>
                  </div>
                  <h4 className="mt-8 text-xl font-semibold">{challenge.title}</h4>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">{challenge.summary || challenge.description}</p>
                  <div className="mt-6 flex justify-between text-xs text-neutral-500">
                    <span>{challenge.submission_count || 0} submissions</span>
                    <span>Due {formatDate(challenge.deadline_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

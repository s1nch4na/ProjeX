import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getChallenge,
  getMyChallengeSubmission,
  submitChallengeWork,
  updateChallengeSubmission,
} from "../utils/api";

const initialForm = {
  project_title: "",
  description: "",
  external_link: "",
  repository_link: "",
  preview_image_url: "",
};

function formatDate(value) {
  return value
    ? new Date(value).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Date unavailable";
}

export default function ChallengeDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem("projex_user") || "null"));
    } catch {
      setUser(null);
    }

    let cancelled = false;
    Promise.all([
      getChallenge(id),
      getMyChallengeSubmission(id).catch(() => null),
    ])
      .then(([challengeData, ownSubmission]) => {
        if (cancelled) return;
        setData(challengeData);
        setSubmission(ownSubmission);
        if (ownSubmission) {
          setForm({
            project_title: ownSubmission.project_title || "",
            description: ownSubmission.description || "",
            external_link: ownSubmission.external_link || "",
            repository_link: ownSubmission.repository_link || "",
            preview_image_url: ownSubmission.preview_image_url || "",
          });
        }
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError.message || "Could not load challenge.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFeedback("");
    try {
      const result = submission
        ? await updateChallengeSubmission(submission.id, form)
        : await submitChallengeWork(id, form);
      setSubmission(result.submission);
      setFeedback(submission ? "Submission updated." : "Submission received.");
    } catch (submitError) {
      setFeedback(submitError.message || "Could not save submission.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-sm text-neutral-500">Loading challenge...</div>;
  if (error || !data) return <div className="p-12 text-center text-red-700">{error || "Challenge not found."}</div>;

  const { challenge, submissions } = data;
  const canSubmit = user?.role === "student" && challenge.status === "Active";

  return (
    <div className="min-h-screen bg-[#F3F3EF] px-6 py-10 md:px-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        <Link to="/student" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-black">← Back to challenges</Link>
        <header className="mt-8 max-w-4xl">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-black px-3 py-1 text-[10px] uppercase tracking-widest text-white">{challenge.status}</span>
            {challenge.category && <span className="rounded-full border border-neutral-300 px-3 py-1 text-[10px] uppercase tracking-widest">{challenge.category}</span>}
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">{challenge.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-600">{challenge.description}</p>
          {challenge.cover_image_url && (
            <img
              src={challenge.cover_image_url}
              alt=""
              className="mt-8 aspect-[3/1] w-full rounded-2xl border border-neutral-200 object-cover"
            />
          )}
          <div className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 bg-white p-4"><span className="block text-xs uppercase tracking-widest text-neutral-500">Starts</span>{formatDate(challenge.start_at)}</div>
            <div className="rounded-xl border border-neutral-200 bg-white p-4"><span className="block text-xs uppercase tracking-widest text-neutral-500">Deadline</span>{formatDate(challenge.deadline_at)}</div>
          </div>
        </header>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8">
            <h2 className="text-2xl font-semibold">Community submissions</h2>
            <p className="mt-2 text-sm text-neutral-500">{challenge.submission_count || 0} public submissions</p>
            {(challenge.rules || challenge.submission_requirements) && (
              <div className="mt-6 grid gap-4 border-y border-neutral-200 py-5 sm:grid-cols-2">
                {challenge.rules && (
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-neutral-500">Rules</h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-700">{challenge.rules}</p>
                  </div>
                )}
                {challenge.submission_requirements && (
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-neutral-500">Submission requirements</h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-700">{challenge.submission_requirements}</p>
                  </div>
                )}
              </div>
            )}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {submissions.length === 0 ? <p className="text-sm text-neutral-500">No public submissions yet.</p> : submissions.map((item) => (
                <article key={item.submission_id} className="rounded-xl border border-neutral-200 p-4">
                  {item.preview_image_url && <img src={item.preview_image_url} alt="" className="mb-4 aspect-video w-full rounded-lg object-cover" />}
                  <div className="flex flex-wrap gap-2">
                    {item.is_winner && <span className="rounded-full bg-black px-2 py-1 text-[10px] uppercase text-white">Winner</span>}
                    {item.is_featured && <span className="rounded-full bg-neutral-100 px-2 py-1 text-[10px] uppercase">Featured</span>}
                  </div>
                  <h3 className="mt-3 font-semibold">{item.project_title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-600">{item.description}</p>
                  <Link to={`/creators/${item.student_id}`} className="mt-4 inline-block text-xs underline">{item.student_name}</Link>
                  {item.external_link && <a href={item.external_link} target="_blank" rel="noreferrer" className="ml-4 text-xs underline">View work ↗</a>}
                </article>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl border border-black bg-black p-6 text-white md:p-8">
            <h2 className="text-2xl font-semibold">Submit your work</h2>
            {!user ? (
              <p className="mt-4 text-sm text-neutral-300">Log in as a student to participate.</p>
            ) : user.role !== "student" ? (
              <p className="mt-4 text-sm text-neutral-300">Project Owners can view challenges but cannot submit student work.</p>
            ) : !canSubmit ? (
              <p className="mt-4 text-sm text-neutral-300">Submissions are closed for this challenge.</p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <input required name="project_title" value={form.project_title} onChange={updateField} placeholder="Project title" className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none" />
                <textarea required name="description" value={form.description} onChange={updateField} placeholder="Describe what you built..." rows={6} className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none" />
                <input name="external_link" value={form.external_link} onChange={updateField} placeholder="Live project link (optional)" className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none" />
                <input name="repository_link" value={form.repository_link} onChange={updateField} placeholder="GitHub / Figma / portfolio link" className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none" />
                <input name="preview_image_url" value={form.preview_image_url} onChange={updateField} placeholder="Preview image URL (optional)" className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none" />
                {feedback && <p className="text-sm text-neutral-300" aria-live="polite">{feedback}</p>}
                <button disabled={saving} className="w-full rounded-lg bg-white px-4 py-3 text-xs uppercase tracking-widest text-black disabled:opacity-50">{saving ? "Saving..." : submission ? "Update submission" : "Submit work →"}</button>
              </form>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

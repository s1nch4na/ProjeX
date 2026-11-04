import React, { useEffect, useState } from "react";
import {
  createChallenge,
  editChallenge,
  getAdminChallenges,
  getAdminSubmissions,
  reviewChallengeSubmission,
  updateChallengeStatus,
} from "../../utils/api";
import { PROFESSIONAL_CATEGORIES } from "../../utils/profileCategories";

const blank = {
  title: "",
  summary: "",
  description: "",
  category: PROFESSIONAL_CATEGORIES[0],
  cover_image_url: "",
  start_at: "",
  deadline_at: "",
  rules: "",
  submission_requirements: "",
};

export default function AdminChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  const loadChallenges = () => {
    setLoading(true);
    getAdminChallenges()
      .then(setChallenges)
      .catch((error) => setFeedback(error.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadSubmissions = (id) => {
    setSelectedId(id);
    getAdminSubmissions(id).then(setSubmissions).catch((error) => setFeedback(error.message));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await editChallenge(editingId, { ...form, status: "Upcoming" });
      } else {
        await createChallenge(form);
      }
      setForm(blank);
      setEditingId(null);
      setFeedback(editingId ? "Challenge updated." : "Challenge saved as a draft.");
      loadChallenges();
    } catch (error) {
      setFeedback(error.message);
    }
  };

  const beginEdit = (challenge) => {
    const toInputDate = (value) => value ? new Date(value).toISOString().slice(0, 16) : "";
    setEditingId(challenge.id);
    setForm({
      title: challenge.title || "",
      summary: challenge.summary || "",
      description: challenge.description || "",
      category: challenge.category || PROFESSIONAL_CATEGORIES[0],
      cover_image_url: challenge.cover_image_url || "",
      start_at: toInputDate(challenge.start_at),
      deadline_at: toInputDate(challenge.deadline_at),
      rules: challenge.rules || "",
      submission_requirements: challenge.submission_requirements || "",
    });
  };

  const changeStatus = async (id, status) => {
    try {
      await updateChallengeStatus(id, status);
      setFeedback(`Challenge ${status.toLowerCase()}.`);
      loadChallenges();
    } catch (error) {
      setFeedback(error.message);
    }
  };

  const review = async (id, values) => {
    try {
      await reviewChallengeSubmission(id, values);
      if (selectedId) loadSubmissions(selectedId);
    } catch (error) {
      setFeedback(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F3EF] px-6 py-10 md:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 border-b border-black pb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">ProJeX team</p>
          <h1 className="mt-2 text-4xl font-semibold">Challenge management</h1>
          {feedback && <p className="mt-3 text-sm text-neutral-600" aria-live="polite">{feedback}</p>}
        </header>

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <form onSubmit={handleCreate} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">{editingId ? "Edit challenge" : "Create challenge"}</h2>
            <p className="mt-2 text-sm text-neutral-500">New challenges start as drafts. Publish them when the dates and brief are ready.</p>
            <div className="mt-6 space-y-4">
              <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="admin-input" />
              <input placeholder="Short summary" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="admin-input" />
              <textarea required placeholder="Full description" rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="admin-input" />
              <input placeholder="Cover image URL (optional)" value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} className="admin-input" />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="admin-input">
                {PROFESSIONAL_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
              </select>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs uppercase tracking-widest text-neutral-500">Start<input required type="datetime-local" value={form.start_at} onChange={(e) => setForm({ ...form, start_at: e.target.value })} className="admin-input mt-2" /></label>
                <label className="text-xs uppercase tracking-widest text-neutral-500">Deadline<input required type="datetime-local" value={form.deadline_at} onChange={(e) => setForm({ ...form, deadline_at: e.target.value })} className="admin-input mt-2" /></label>
              </div>
              <textarea placeholder="Rules (optional)" rows={3} value={form.rules} onChange={(e) => setForm({ ...form, rules: e.target.value })} className="admin-input" />
              <textarea placeholder="Submission requirements (optional)" rows={3} value={form.submission_requirements} onChange={(e) => setForm({ ...form, submission_requirements: e.target.value })} className="admin-input" />
              <button className="w-full rounded-xl bg-black px-4 py-3 text-xs uppercase tracking-widest text-white">{editingId ? "Save changes →" : "Save draft →"}</button>
              {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(blank); }} className="w-full rounded-xl border border-black px-4 py-3 text-xs uppercase tracking-widest">Cancel edit</button>}
            </div>
          </form>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Challenges</h2>
            {loading ? <p className="text-sm text-neutral-500">Loading...</p> : (
              <div className="space-y-3">
                {challenges.map((challenge) => (
                  <article key={challenge.id} className="rounded-xl border border-neutral-200 bg-white p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div><h3 className="font-semibold">{challenge.title}</h3><p className="mt-1 text-xs text-neutral-500">{challenge.status} · {challenge.submission_count || 0} submissions</p></div>
                      <div className="flex gap-3">
                        {challenge.status !== "Closed" && <button type="button" onClick={() => beginEdit(challenge)} className="text-xs underline">Edit</button>}
                        <button type="button" onClick={() => loadSubmissions(challenge.id)} className="text-xs underline">Review submissions</button>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {challenge.status === "Draft" && <button type="button" onClick={() => changeStatus(challenge.id, "Upcoming")} className="rounded-lg bg-black px-3 py-2 text-[10px] uppercase tracking-widest text-white">Publish</button>}
                      {challenge.status !== "Closed" && <button type="button" onClick={() => changeStatus(challenge.id, "Closed")} className="rounded-lg border border-black px-3 py-2 text-[10px] uppercase tracking-widest">Close</button>}
                    </div>
                  </article>
                ))}
              </div>
            )}

            {selectedId && (
              <div className="mt-8 rounded-2xl border border-black bg-white p-6">
                <h2 className="text-xl font-semibold">Submission review</h2>
                <div className="mt-4 space-y-4">
                  {submissions.length === 0 ? <p className="text-sm text-neutral-500">No submissions yet.</p> : submissions.map((submission) => (
                    <article key={submission.id} className="border-t border-neutral-200 pt-4">
                      <div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold">{submission.project_title}</h3><p className="text-xs text-neutral-500">{submission.student_name} · {submission.student_email}</p></div><span className="text-xs">{submission.is_public ? "Public" : "Hidden"}</span></div>
                      <p className="mt-2 text-sm text-neutral-600">{submission.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button type="button" onClick={() => review(submission.id, { is_featured: !submission.is_featured })} className="rounded border border-black px-2 py-1 text-[10px] uppercase">{submission.is_featured ? "Unfeature" : "Feature"}</button>
                        <button type="button" onClick={() => review(submission.id, { is_winner: !submission.is_winner })} className="rounded border border-black px-2 py-1 text-[10px] uppercase">{submission.is_winner ? "Remove winner" : "Select winner"}</button>
                        <button type="button" onClick={() => review(submission.id, { is_public: !submission.is_public })} className="rounded border border-black px-2 py-1 text-[10px] uppercase">{submission.is_public ? "Hide" : "Publish"}</button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
      <style>{`.admin-input{width:100%;border:1px solid #d4d4d4;border-radius:.75rem;padding:.75rem .9rem;font-size:.875rem;outline:none;background:white}.admin-input:focus{border-color:#000;box-shadow:0 0 0 2px #0001}`}</style>
    </div>
  );
}

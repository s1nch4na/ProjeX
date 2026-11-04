import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfessionalCategoryChips from "../../components/ProfessionalCategoryChips";
import { getProfile, updateProfile } from "../../utils/api";
import { parseProfileList } from "../../utils/profileCategories";

const emptyForm = {
  name: "",
  position: "",
  bio: "",
  location: "",
  github: "",
  linkedin: "",
  skills: [],
  phone: "",
  organization: "",
  website: "",
  interests: [],
  professional_categories: [],
  resume_name: "",
  avatar_name: "",
};

function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10";

export default function EditProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      let savedUser;
      try {
        savedUser = JSON.parse(localStorage.getItem("projex_user") || "null");
      } catch {
        savedUser = null;
      }

      if (!savedUser?.id) {
        navigate("/login");
        return;
      }

      try {
        const result = await getProfile(savedUser.id);
        if (!result?.success || !result.user) {
          throw new Error(result?.error || "Could not load your profile.");
        }

        if (!cancelled) {
          const profile = result.user;
          setUser(profile);
          setForm({
            ...emptyForm,
            ...profile,
            skills: parseProfileList(profile.skills),
            interests: parseProfileList(profile.interests),
            professional_categories: parseProfileList(
              profile.professional_categories
            ),
          });
        }
      } catch (error) {
        if (!cancelled) {
          setFeedback({
            type: "error",
            message: error.message || "Could not load your profile.",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const isProjectOwner = user?.role === "investor";
  const completion = useMemo(() => {
    const fields = isProjectOwner
      ? [form.name, form.position, form.organization, form.bio, form.location]
      : [form.name, form.position, form.bio, form.location, form.skills.length];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [form, isProjectOwner]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFeedback({ type: "", message: "" });
  };

  const addSkill = (event) => {
    event.preventDefault();
    const skill = skillInput.trim();
    if (!skill || form.skills.includes(skill)) {
      setSkillInput("");
      return;
    }
    setForm((current) => ({ ...current, skills: [...current.skills, skill] }));
    setSkillInput("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user?.id) return;

    setSaving(true);
    setFeedback({ type: "", message: "" });

    try {
      const result = await updateProfile(user.id, {
        name: form.name.trim(),
        position: form.position.trim(),
        bio: form.bio.trim(),
        location: form.location.trim(),
        github: isProjectOwner ? null : form.github.trim(),
        linkedin: form.linkedin.trim(),
        skills: isProjectOwner ? [] : form.skills,
        phone: isProjectOwner ? form.phone.trim() : null,
        organization: isProjectOwner ? form.organization.trim() : null,
        website: isProjectOwner ? form.website.trim() : null,
        interests: isProjectOwner ? form.interests : [],
        professional_categories: form.professional_categories,
      });

      if (!result?.success) {
        throw new Error(result?.error || "Could not save your profile.");
      }

      setUser(result.user);
      setFeedback({ type: "success", message: "Profile saved successfully." });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Could not save your profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F3EF]">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          Loading profile editor...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F3EF] px-6">
        <p role="alert" className="text-sm text-red-700">
          {feedback.message || "Profile unavailable."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F3EF] text-[#111]">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-xs uppercase tracking-[0.16em] text-neutral-500 hover:text-black"
          >
            ← Back
          </button>
          <span className="text-sm font-semibold tracking-[0.2em]">PROJEX</span>
          <span className="hidden text-xs uppercase tracking-[0.16em] text-neutral-400 sm:block">
            Profile editor
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-16">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-neutral-500">
            Your professional identity
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Shape the profile people remember.
          </h1>
          <p className="mt-4 text-base leading-7 text-neutral-600">
            Keep your information clear, current, and useful to the people you
            want to work with.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-black text-2xl font-semibold text-white">
                  {form.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-xl font-semibold">{form.name || "Your name"}</p>
                  <p className="mt-1 text-sm text-neutral-500">
                    {isProjectOwner ? "Project Owner" : "Student"}
                  </p>
                  {form.avatar_name && (
                    <p className="mt-2 text-xs text-neutral-400">
                      Avatar: {form.avatar_name}
                    </p>
                  )}
                </div>
              </div>
              <div className="min-w-[220px]">
                <div className="mb-2 flex justify-between text-xs uppercase tracking-[0.14em] text-neutral-500">
                  <span>Profile completion</span>
                  <span>{completion}%</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-100">
                  <div
                    className="h-2 rounded-full bg-black transition-all"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:grid-cols-[0.7fr_1.3fr] md:p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                01 / Personal
              </p>
              <h2 className="mt-2 text-2xl font-semibold">The essentials</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-500">
                Make it easy for the right people to understand who you are.
              </p>
            </div>
            <div className="grid gap-5">
              <Field label="Full name">
                <input className={inputClass} name="name" value={form.name} onChange={updateField} required />
              </Field>
              <Field label={isProjectOwner ? "Designation" : "Professional headline"}>
                <input className={inputClass} name="position" value={form.position} onChange={updateField} placeholder={isProjectOwner ? "Founder, Product Lead..." : "Full-stack developer, designer..."} />
              </Field>
              <Field label="Location">
                <input className={inputClass} name="location" value={form.location} onChange={updateField} placeholder="Bengaluru, India" />
              </Field>
              <Field label={isProjectOwner ? "Business description" : "About you"}>
                <textarea className={`${inputClass} min-h-32 resize-y`} name="bio" value={form.bio} onChange={updateField} placeholder="A concise introduction..." />
              </Field>
            </div>
          </section>

          <section className="grid gap-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:grid-cols-[0.7fr_1.3fr] md:p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                02 / Professional
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Your direction</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-500">
                Skills describe what you do. Categories describe the fields you
                work in or want to explore.
              </p>
            </div>
            <div className="space-y-7">
              {isProjectOwner && (
                <>
                  <Field label="Organization / company">
                    <input className={inputClass} name="organization" value={form.organization} onChange={updateField} />
                  </Field>
                  <Field label="Phone">
                    <input className={inputClass} name="phone" value={form.phone} onChange={updateField} />
                  </Field>
                </>
              )}
              {!isProjectOwner && (
                <Field label="Skills">
                  <div className="flex gap-2">
                    <input className={inputClass} value={skillInput} onChange={(event) => setSkillInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addSkill(event)} placeholder="Add a skill" />
                    <button type="button" onClick={addSkill} className="rounded-xl bg-black px-5 text-xs uppercase tracking-[0.14em] text-white">Add</button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {form.skills.map((skill) => (
                      <button key={skill} type="button" onClick={() => setForm((current) => ({ ...current, skills: current.skills.filter((item) => item !== skill) }))} className="rounded-full bg-neutral-100 px-3 py-2 text-xs hover:bg-black hover:text-white">
                        {skill} ×
                      </button>
                    ))}
                    {form.skills.length === 0 && <span className="text-sm text-neutral-500">No skills added yet.</span>}
                  </div>
                </Field>
              )}
              <Field label="Professional categories">
                <ProfessionalCategoryChips
                  selected={form.professional_categories}
                  onChange={(professional_categories) => setForm((current) => ({ ...current, professional_categories }))}
                />
              </Field>
            </div>
          </section>

          <section className="grid gap-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:grid-cols-[0.7fr_1.3fr] md:p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                03 / Links
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Stay connected</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {!isProjectOwner && (
                <Field label="GitHub">
                  <input className={inputClass} name="github" value={form.github} onChange={updateField} placeholder="github.com/username" />
                </Field>
              )}
              <Field label="LinkedIn">
                <input className={inputClass} name="linkedin" value={form.linkedin} onChange={updateField} placeholder="linkedin.com/in/username" />
              </Field>
              {isProjectOwner && (
                <Field label="Website">
                  <input className={inputClass} name="website" value={form.website} onChange={updateField} placeholder="yourcompany.com" />
                </Field>
              )}
              {!isProjectOwner && (
                <Field label="Resume">
                  <div className="rounded-xl border border-dashed border-neutral-300 px-4 py-3 text-sm text-neutral-500">
                    {form.resume_name || "No resume uploaded yet."}
                  </div>
                </Field>
              )}
            </div>
          </section>

          <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between md:p-8">
            <div aria-live="polite">
              {feedback.message && (
                <p className={feedback.type === "error" ? "text-sm text-red-700" : "text-sm text-green-700"}>
                  {feedback.message}
                </p>
              )}
            </div>
            <button type="submit" disabled={saving} className="rounded-xl bg-black px-7 py-3 text-xs uppercase tracking-[0.16em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50">
              {saving ? "Saving..." : "Save changes →"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

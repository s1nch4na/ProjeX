import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProfile } from "../../utils/api";

function parseList(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value.trim()) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function externalHref(value) {
  return value?.startsWith("http") ? value : `https://${value}`;
}

export default function StudentProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [creator, setCreator] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setCurrentUser(
        JSON.parse(localStorage.getItem("projex_user") || "null")
      );
    } catch {
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchProfile() {
      try {
        setLoading(true);
        const data = await getProfile(id);

        if (!data?.success) {
          throw new Error(data?.error || "Profile not found");
        }

        if (!cancelled) setCreator(data.user);
      } catch (error) {
        console.error("Profile fetch error:", error);
        if (!cancelled) setCreator(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (id) fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F3EF] flex items-center justify-center">
        <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-[#F3F3EF] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-3">
            404 / Profile Not Found
          </p>
          <h1 className="text-3xl font-bold">This profile does not exist.</h1>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-5 py-2.5 bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const isProjectOwner = creator.role === "investor";
  const isOwnProfile =
    currentUser?.id &&
    String(currentUser.id) === String(creator.id);
  const skills = parseList(creator.skills);
  const interests = parseList(creator.interests);
  const profileLabel = isProjectOwner ? "Project Owner" : "Student / Creator";

  return (
    <div className="min-h-screen bg-[#F3F3EF] text-black">
      <nav className="px-6 md:px-12 py-6 flex items-center justify-between border-b border-black">
        <button
          onClick={() => navigate(-1)}
          className="font-mono text-xs uppercase tracking-widest hover:underline"
        >
          ← Back
        </button>
        <h1 className="font-black tracking-tight text-xl">PROJEX</h1>
        <button
          className="font-mono text-xs uppercase tracking-widest hover:underline"
          onClick={() =>
            navigator.clipboard
              .writeText(window.location.href)
              .then(() => alert("Profile link copied!"))
              .catch(() => alert("Could not copy profile link."))
          }
        >
          Share
        </button>
      </nav>

      <section className="px-6 md:px-12 pt-10 md:pt-16">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="w-28 h-28 md:w-36 md:h-36 shrink-0 border-2 border-black bg-white overflow-hidden flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-4xl font-bold">
              {creator.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight">
                {creator.name}
              </h1>
              <span className="w-fit px-3 py-1 bg-black text-white text-[10px] font-mono uppercase tracking-widest">
                {profileLabel}
              </span>
            </div>

            {creator.position && (
              <p className="mt-2 text-lg text-neutral-600">
                {creator.position}
              </p>
            )}
            {creator.organization && (
              <p className="mt-1 text-sm text-neutral-500">
                {creator.organization}
              </p>
            )}
            {creator.location && (
              <p className="mt-1 text-sm text-neutral-500">
                {creator.location}
              </p>
            )}
          </div>

          <div>
            {isOwnProfile ? (
              <button
                onClick={() => navigate("/student/profile/edit")}
                className="px-6 py-3 border-2 border-black bg-black text-white text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition"
              >
                Edit Profile
              </button>
            ) : (
              <a
                href={`mailto:${creator.email}`}
                className="px-6 py-3 border-2 border-black bg-white text-xs font-mono uppercase tracking-widest hover:bg-black hover:text-white transition inline-block"
              >
                Contact
              </a>
            )}
          </div>
        </div>

        <p className="max-w-3xl mt-8 text-lg leading-relaxed text-neutral-700">
          {creator.bio || "No bio added yet."}
        </p>
      </section>

      <section className="px-6 md:px-12 py-16">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
              Profile information
            </p>
            <h2 className="text-3xl font-black mt-2">
              {isProjectOwner ? "Project Owner" : "Student Creator"}
            </h2>
          </div>

          <div className="md:col-span-2 space-y-8">
            {isProjectOwner ? (
              <div className="grid sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-xs uppercase text-neutral-500">Contact</p>
                  <a className="underline" href={`mailto:${creator.email}`}>
                    {creator.email}
                  </a>
                </div>
                {creator.phone && (
                  <div>
                    <p className="text-xs uppercase text-neutral-500">Phone</p>
                    <p>{creator.phone}</p>
                  </div>
                )}
                {creator.website && (
                  <div>
                    <p className="text-xs uppercase text-neutral-500">Website</p>
                    <a
                      className="underline"
                      href={externalHref(creator.website)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {creator.website}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6 text-sm">
                <div>
                  <p className="text-xs uppercase text-neutral-500">Resume</p>
                  <p>{creator.resume_name || "No resume added yet."}</p>
                </div>
                <div className="flex flex-wrap gap-5">
                  {creator.github && (
                    <a
                      href={externalHref(creator.github)}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      GitHub ↗
                    </a>
                  )}
                  {creator.linkedin && (
                    <a
                      href={externalHref(creator.linkedin)}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      LinkedIn ↗
                    </a>
                  )}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs uppercase text-neutral-500 mb-3">
                {isProjectOwner ? "Interests" : "Skills and interests"}
              </p>
              <div className="flex flex-wrap gap-3">
                {[...skills, ...interests].length > 0 ? (
                  [...skills, ...interests].map((item, index) => (
                    <span
                      key={`${item}-${index}`}
                      className="px-4 py-2 border border-black bg-white text-xs font-mono uppercase tracking-wider"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <p className="text-neutral-500">None added yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 md:px-12 py-8 border-t border-black">
        <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
          PROJEX / PROFILE
        </p>
      </footer>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../../utils/api";

export default function EditProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
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
    interests: []
  });

  const [skillInput, setSkillInput] = useState("");

  // ==========================================
  // LOAD CURRENT USER
  // ==========================================

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("projex_user");

      if (!savedUser) {
        navigate("/login");
        return;
      }

      const parsedUser = JSON.parse(savedUser);

      setUser(parsedUser);

      let parsedSkills = [];

      try {
        if (Array.isArray(parsedUser.skills)) {
          parsedSkills = parsedUser.skills;
        } else if (typeof parsedUser.skills === "string") {
          parsedSkills = JSON.parse(parsedUser.skills);
        }
      } catch {
        parsedSkills = [];
      }

      let parsedInterests = [];

      try {
        if (Array.isArray(parsedUser.interests)) {
          parsedInterests = parsedUser.interests;
        } else if (typeof parsedUser.interests === "string") {
          parsedInterests = JSON.parse(parsedUser.interests);
        }
      } catch {
        parsedInterests = [];
      }

      setForm({
        name: parsedUser.name || "",
        position: parsedUser.position || "",
        bio: parsedUser.bio || "",
        location: parsedUser.location || "",
        github: parsedUser.github || "",
        linkedin: parsedUser.linkedin || "",
        skills: parsedSkills,
        phone: parsedUser.phone || "",
        organization: parsedUser.organization || "",
        website: parsedUser.website || "",
        interests: parsedInterests
      });

    } catch (error) {
      console.error("Could not load user:", error);
      navigate("/login");
    }
  }, [navigate]);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ==========================================
  // ADD SKILL
  // ==========================================

  const addSkill = (e) => {
    e.preventDefault();

    const skill = skillInput.trim();

    if (!skill) return;

    if (form.skills.includes(skill)) {
      setSkillInput("");
      return;
    }

    setForm((prev) => ({
      ...prev,
      skills: [...prev.skills, skill]
    }));

    setSkillInput("");
  };

  // ==========================================
  // REMOVE SKILL
  // ==========================================

  const removeSkill = (skillToRemove) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter(
        (skill) => skill !== skillToRemove
      )
    }));
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      alert("User information is missing.");
      return;
    }

    setSaving(true);

    try {
      const result = await updateProfile(
        user.id,
        form
      );

      if (!result?.success) {
        throw new Error(
          result?.error || "Failed to update profile."
        );
      }

      alert("Profile updated successfully!");

      navigate(`/creators/${user.id}`);

    } catch (error) {
      console.error("Profile update error:", error);

      alert(
        error.message ||
        "Something went wrong while updating your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F3F3EF] flex items-center justify-center">
        <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F3EF] text-black">

      {/* HEADER */}
      <div className="border-b border-black px-6 md:px-12 py-6 flex items-center justify-between">

        <button
          onClick={() => navigate(-1)}
          className="font-mono text-xs uppercase tracking-widest hover:underline"
        >
          ← Back
        </button>

        <h1 className="font-black text-xl tracking-tight">
          EDIT PROFILE
        </h1>

        <div className="w-10" />

      </div>

      {/* CONTENT */}
      <main className="px-6 md:px-12 py-12 max-w-5xl mx-auto">

        <div className="mb-12">

          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
            Profile Settings
          </p>

          <h2 className="text-4xl md:text-5xl font-black mt-2">
            Make your profile yours.
          </h2>

          <p className="mt-4 text-neutral-600 max-w-2xl">
            Update the information people see when they visit your
            ProJeX creator profile.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-10"
        >

          {/* BASIC INFORMATION */}
          <section className="border-t border-black pt-8">

            <div className="grid md:grid-cols-3 gap-8">

              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                  01 / Identity
                </p>

                <h3 className="text-xl font-bold mt-2">
                  Basic information
                </h3>
              </div>

              <div className="md:col-span-2 space-y-6">

                {/* NAME */}
                <div>

                  <label className="block text-xs font-mono uppercase tracking-widest mb-2">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border border-black bg-white px-4 py-3 focus:outline-none"
                    required
                  />

                </div>

                {/* PROFESSIONAL POSITION */}
                <div>

                  <label className="block text-xs font-mono uppercase tracking-widest mb-2">
                    Professional position
                  </label>

                  <input
                    type="text"
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    placeholder="e.g. Full Stack Developer or Founder"
                    className="w-full border border-black bg-white px-4 py-3 focus:outline-none"
                  />

                </div>

                {/* LOCATION */}
                <div>

                  <label className="block text-xs font-mono uppercase tracking-widest mb-2">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Bengaluru, India"
                    className="w-full border border-black bg-white px-4 py-3 focus:outline-none"
                  />

                </div>

                {user.role === "investor" && (
                  <>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest mb-2">
                        Organization
                      </label>
                      <input
                        type="text"
                        name="organization"
                        value={form.organization}
                        onChange={handleChange}
                        className="w-full border border-black bg-white px-4 py-3 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest mb-2">
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full border border-black bg-white px-4 py-3 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest mb-2">
                        Website
                      </label>
                      <input
                        type="text"
                        name="website"
                        value={form.website}
                        onChange={handleChange}
                        className="w-full border border-black bg-white px-4 py-3 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest mb-2">
                        Interests
                      </label>
                      <input
                        type="text"
                        value={form.interests.join(", ")}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            interests: e.target.value
                              .split(",")
                              .map((interest) => interest.trim())
                              .filter(Boolean),
                          }))
                        }
                        placeholder="e.g. SaaS, education, fintech"
                        className="w-full border border-black bg-white px-4 py-3 focus:outline-none"
                      />
                    </div>
                  </>
                )}

              </div>

            </div>

          </section>

          {/* ABOUT */}
          <section className="border-t border-black pt-8">

            <div className="grid md:grid-cols-3 gap-8">

              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                  02 / About
                </p>

                <h3 className="text-xl font-bold mt-2">
                  Tell people about yourself
                </h3>
              </div>

              <div className="md:col-span-2">

                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={7}
                  placeholder="Tell people what you do, what you're interested in, and what you're building..."
                  className="w-full border border-black bg-white px-4 py-3 resize-none focus:outline-none"
                />

              </div>

            </div>

          </section>

          {/* SKILLS */}
          <section className="border-t border-black pt-8">

            <div className="grid md:grid-cols-3 gap-8">

              <div>

                <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                  03 / Skills
                </p>

                <h3 className="text-xl font-bold mt-2">
                  What do you work with?
                </h3>

              </div>

              <div className="md:col-span-2">

                <div className="flex gap-2">

                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) =>
                      setSkillInput(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addSkill(e);
                      }
                    }}
                    placeholder="Add a skill..."
                    className="flex-1 border border-black bg-white px-4 py-3 focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-5 border-2 border-black bg-black text-white text-xs font-mono uppercase tracking-widest hover:bg-neutral-800"
                  >
                    Add
                  </button>

                </div>

                <div className="flex flex-wrap gap-3 mt-5">

                  {form.skills.length > 0 ? (
                    form.skills.map((skill, index) => (
                      <button
                        type="button"
                        key={index}
                        onClick={() => removeSkill(skill)}
                        className="px-4 py-2 border border-black bg-white text-xs font-mono uppercase tracking-wider hover:bg-black hover:text-white"
                        title="Remove skill"
                      >
                        {skill} ×
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-neutral-500">
                      No skills added yet.
                    </p>
                  )}

                </div>

              </div>

            </div>

          </section>

          {/* LINKS */}
          <section className="border-t border-black pt-8">

            <div className="grid md:grid-cols-3 gap-8">

              <div>

                <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                  04 / Links
                </p>

                <h3 className="text-xl font-bold mt-2">
                  Your online presence
                </h3>

              </div>

              <div className="md:col-span-2 space-y-6">

                {/* GITHUB */}
                <div>

                  <label className="block text-xs font-mono uppercase tracking-widest mb-2">
                    GitHub
                  </label>

                  <input
                    type="text"
                    name="github"
                    value={form.github}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                    className="w-full border border-black bg-white px-4 py-3 focus:outline-none"
                  />

                </div>

                {/* LINKEDIN */}
                <div>

                  <label className="block text-xs font-mono uppercase tracking-widest mb-2">
                    LinkedIn
                  </label>

                  <input
                    type="text"
                    name="linkedin"
                    value={form.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full border border-black bg-white px-4 py-3 focus:outline-none"
                  />

                </div>

              </div>

            </div>

          </section>

          {/* SAVE */}
          <section className="border-t border-black pt-8 flex flex-col sm:flex-row justify-between gap-4">

            <button
              type="button"
              onClick={() => navigate(`/creators/${user.id}`)}
              className="px-6 py-3 border-2 border-black bg-white text-xs font-mono uppercase tracking-widest hover:bg-black hover:text-white transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-black text-white text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes →"}
            </button>

          </section>

        </form>

      </main>

    </div>
  );
}
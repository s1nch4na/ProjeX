// src/pages/ProfileOnboarding.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { completeProfile } from "../utils/api";

export default function ProfileOnboarding({ user }) {
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    role: "",
    bio: "",
    location: "",
    github: "",
    linkedin: "",
    resume: null,
    avatar: null,
  });

  // -----------------------------
  // HANDLE INPUTS
  // -----------------------------

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // -----------------------------
  // ADD SKILL
  // -----------------------------

  const handleAddSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    if (skills.includes(skill)) {
      setSkillInput("");
      return;
    }

    setSkills((prev) => [...prev, skill]);
    setSkillInput("");
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // -----------------------------
  // REMOVE SKILL
  // -----------------------------

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) =>
      prev.filter((skill) => skill !== skillToRemove)
    );
  };

  // -----------------------------
  // SUBMIT
  // -----------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.email) {
      alert("User information is missing. Please sign up again.");
      return;
    }

    if (!formData.bio.trim()) {
      alert("Please write something about yourself.");
      return;
    }

    if (skills.length === 0) {
      alert("Please add at least one skill.");
      return;
    }

    if (!formData.resume) {
      alert("Please upload your resume.");
      return;
    }

    const profileData = {
  email: user.email,
  name: formData.name.trim(),
  role: formData.role.trim(),
  bio: formData.bio.trim(),
  skills,
  location: formData.location.trim(),
  github: formData.github.trim(),
  linkedin: formData.linkedin.trim(),
  resumeName: formData.resume ? formData.resume.name : null,
  avatarName: formData.avatar ? formData.avatar.name : null,
};

    const result = await completeProfile(profileData);

    if (result?.success) {
      alert("Profile completed successfully!");
      navigate(user.role === "investor" ? "/investor" : "/student");
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F3EF] text-[#0A0A0A] font-sans">

      {/* HEADER */}
      <header className="border-b-2 border-black bg-white px-6 md:px-12 py-5">
        <div className="max-w-6xl mx-auto flex justify-between items-center">

          <div>
            <span className="text-xs font-mono uppercase tracking-widest bg-black text-white px-2 py-1">
              ProjeX Network
            </span>

            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mt-3">
              Create Your Profile
            </h1>

            <p className="text-xs md:text-sm text-neutral-500 mt-1">
              Build your creator identity before entering ProjeX.
            </p>
          </div>

          <div className="hidden md:block text-right">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
              Profile Setup
            </span>

            <p className="text-sm font-bold mt-1">
              STEP 1 / 1
            </p>
          </div>

        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-6 md:px-12 py-10">

        <form onSubmit={handleSubmit}>

          {/* PROFILE INFORMATION */}
          <section className="bg-white border-2 border-black p-6 md:p-8 mb-6">

            <div className="border-b border-black pb-4 mb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                01 — Identity
              </span>

              <h2 className="text-xl font-bold uppercase mt-1">
                Profile Information
              </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">

              {/* AVATAR */}
              <div className="shrink-0">

                <div className="w-32 h-32 border-2 border-black bg-[#F3F3EF] overflow-hidden flex items-center justify-center">

                  {formData.avatar ? (
                    <img
                      src={URL.createObjectURL(formData.avatar)}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-mono uppercase text-neutral-400 text-center px-4">
                      No Photo
                    </span>
                  )}

                </div>

                <label className="block mt-3">

                  <span className="block text-center bg-black text-white px-3 py-2 text-[10px] font-mono uppercase tracking-wider cursor-pointer hover:bg-neutral-800">
                    Upload Photo
                  </span>

                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />

                </label>

              </div>

              {/* BASIC INFO */}
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* NAME */}
                <div>
                  <label className="block text-xs font-bold uppercase mb-2">
                    Full Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Alex Rivera"
                    required
                    className="w-full border-2 border-black bg-[#F3F3EF] px-3 py-3 text-sm focus:outline-none focus:bg-white"
                  />
                </div>

                {/* ROLE */}
                <div>
                  <label className="block text-xs font-bold uppercase mb-2">
                    Professional Role *
                  </label>

                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g. Full-Stack Developer"
                    required
                    className="w-full border-2 border-black bg-[#F3F3EF] px-3 py-3 text-sm focus:outline-none focus:bg-white"
                  />
                </div>

                {/* LOCATION */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase mb-2">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Bengaluru, India"
                    className="w-full border-2 border-black bg-[#F3F3EF] px-3 py-3 text-sm focus:outline-none focus:bg-white"
                  />
                </div>

                {/* BIO */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase mb-2">
                    About You *
                  </label>

                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell people what you build, what you're interested in, and what kind of work you enjoy..."
                    rows={5}
                    required
                    className="w-full border-2 border-black bg-[#F3F3EF] px-3 py-3 text-sm resize-none focus:outline-none focus:bg-white"
                  />
                </div>

              </div>

            </div>
          </section>

          {/* SKILLS */}
          <section className="bg-white border-2 border-black p-6 md:p-8 mb-6">

            <div className="border-b border-black pb-4 mb-6">

              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                02 — Expertise
              </span>

              <h2 className="text-xl font-bold uppercase mt-1">
                Skills
              </h2>

              <p className="text-xs text-neutral-500 mt-2">
                Add the technologies and skills you want to showcase.
              </p>

            </div>

            <div className="flex gap-2">

              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="e.g. React, Java, SQL..."
                className="flex-1 border-2 border-black bg-[#F3F3EF] px-3 py-3 text-sm focus:outline-none focus:bg-white"
              />

              <button
                type="button"
                onClick={handleAddSkill}
                className="px-5 bg-black text-white border-2 border-black text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 cursor-pointer"
              >
                Add
              </button>

            </div>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">

                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 border-2 border-black bg-[#F3F3EF] px-3 py-2"
                  >

                    <span className="text-xs font-mono uppercase">
                      {skill}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-xs font-bold hover:text-red-600 cursor-pointer"
                      title={`Remove ${skill}`}
                    >
                      ×
                    </button>

                  </div>
                ))}

              </div>
            )}

          </section>

          {/* RESUME */}
          <section className="bg-white border-2 border-black p-6 md:p-8 mb-6">

            <div className="border-b border-black pb-4 mb-6">

              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                03 — Credentials
              </span>

              <h2 className="text-xl font-bold uppercase mt-1">
                Resume
              </h2>

              <p className="text-xs text-neutral-500 mt-2">
                Upload your latest resume so investors can understand your experience.
              </p>

            </div>

            <label className="block border-2 border-dashed border-black bg-[#F3F3EF] p-8 text-center cursor-pointer hover:bg-white transition">

              <div className="text-2xl mb-2">
                ↑
              </div>

              <p className="text-xs font-bold uppercase">
                {formData.resume
                  ? formData.resume.name
                  : "Upload your resume"}
              </p>

              <p className="text-[10px] font-mono uppercase text-neutral-500 mt-2">
                PDF, DOC or DOCX
              </p>

              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                className="hidden"
              />

            </label>

          </section>

          {/* LINKS */}
          <section className="bg-white border-2 border-black p-6 md:p-8 mb-8">

            <div className="border-b border-black pb-4 mb-6">

              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                04 — Online Presence
              </span>

              <h2 className="text-xl font-bold uppercase mt-1">
                Links
              </h2>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* GITHUB */}
              <div>
                <label className="block text-xs font-bold uppercase mb-2">
                  GitHub
                </label>

                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className="w-full border-2 border-black bg-[#F3F3EF] px-3 py-3 text-sm focus:outline-none focus:bg-white"
                />
              </div>

              {/* LINKEDIN */}
              <div>
                <label className="block text-xs font-bold uppercase mb-2">
                  LinkedIn
                </label>

                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full border-2 border-black bg-[#F3F3EF] px-3 py-3 text-sm focus:outline-none focus:bg-white"
                />
              </div>

            </div>

          </section>

          {/* COMPLETE PROFILE */}
          <div className="border-2 border-black bg-black text-white p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">

            <div>
              <p className="text-sm font-bold uppercase">
                Ready to enter ProjeX?
              </p>

              <p className="text-xs text-neutral-400 mt-1">
                Complete your profile to access the platform.
              </p>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto bg-white text-black px-8 py-4 border-2 border-white text-xs font-mono font-bold uppercase tracking-widest hover:bg-neutral-200 cursor-pointer"
            >
              Complete Profile →
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}
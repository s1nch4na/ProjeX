import React from "react";

const projects = [
  {
    id: 1,
    title: "EcoKart Brand Identity",
    category: "Branding / UI Design",
    description:
      "A complete visual identity and digital experience designed for a sustainable commerce platform.",
    color: "bg-[#D9E4D5]",
    size: "large",
  },
  {
    id: 2,
    title: "Campus Connect",
    category: "Web Design / Development",
    description:
      "A student-focused platform connecting communities, events and opportunities.",
    color: "bg-[#E5D9D1]",
    size: "small",
  },
  {
    id: 3,
    title: "Orbit Finance",
    category: "Product Design",
    description:
      "A minimal financial dashboard exploring data visualization and personal finance.",
    color: "bg-[#D7DCE5]",
    size: "small",
  },
  {
    id: 4,
    title: "Reimagining Student Portfolios",
    category: "Research / UX",
    description:
      "An exploration of how students can present technical and creative work beyond a traditional resume.",
    color: "bg-[#E7E1C9]",
    size: "large",
  },
];

const skills = [
  "UI/UX",
  "React",
  "Branding",
  "Figma",
  "Frontend",
  "Prototyping",
];

export default function Profile() {
  return (
    <div className="min-h-screen bg-[#F3F3EF] text-[#0A0A0A] font-sans selection:bg-black selection:text-white">

      {/* NAV */}
      <nav className="border-b border-black px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="font-black text-xl tracking-tight">
          PROJEX<span className="text-neutral-400">.</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-mono">
          <button className="hover:underline">Discover</button>
          <button className="hover:underline">Projects</button>
          <button className="hover:underline">People</button>
        </div>

        <button className="border border-black px-4 py-2 text-xs font-mono uppercase hover:bg-black hover:text-white transition">
          Edit Profile
        </button>
      </nav>

      {/* PROFILE HERO */}
      <section className="px-6 md:px-12 pt-12 md:pt-20">

        {/* Cover */}
        <div className="h-48 md:h-72 bg-black relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full grid grid-cols-8">
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-white"
                />
              ))}
            </div>
          </div>

          <div className="absolute bottom-6 left-6 md:left-10 text-white">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-2 text-neutral-400">
              PROJEX / CREATOR PROFILE
            </p>

            <p className="text-xs font-mono uppercase tracking-wider">
              Bengaluru, India
            </p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="relative border-x border-b border-black bg-[#F3F3EF] px-6 md:px-10 pb-10">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">

            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">

              {/* Avatar */}
              <div className="-mt-12 md:-mt-16 w-28 h-28 md:w-36 md:h-36 bg-white border-2 border-black flex items-center justify-center shrink-0">
                <span className="font-mono text-[10px] uppercase text-neutral-400">
                  Avatar
                </span>
              </div>

              <div className="pt-4 md:pt-5">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                    Your Name
                  </h1>

                  <span className="border border-black px-2 py-1 text-[9px] font-mono uppercase">
                    Creator
                  </span>
                </div>

                <p className="text-sm md:text-base max-w-xl leading-relaxed text-neutral-600">
                  Designer, developer and creative problem solver building
                  digital experiences, products and experiments.
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="border border-neutral-400 px-3 py-1 text-[10px] font-mono uppercase"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition">
                Follow
              </button>

              <button className="px-6 py-3 border border-black text-xs font-mono uppercase tracking-wider hover:bg-black hover:text-white transition">
                Share ↗
              </button>
            </div>

          </div>

          {/* Stats */}
          <div className="mt-10 pt-6 border-t border-neutral-300 flex gap-10 font-mono text-xs uppercase">
            <div>
              <span className="block text-xl font-bold mb-1">12</span>
              Projects
            </div>

            <div>
              <span className="block text-xl font-bold mb-1">348</span>
              Followers
            </div>

            <div>
              <span className="block text-xl font-bold mb-1">91</span>
              Following
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="px-6 md:px-12 py-16">

        {/* PROJECT HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500 mb-2">
              Selected Work
            </p>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Projects
            </h2>
          </div>

          <div className="flex gap-5 text-xs font-mono uppercase">
            <button className="underline underline-offset-4">
              Featured
            </button>
            <button className="text-neutral-400 hover:text-black">
              Latest
            </button>
            <button className="text-neutral-400 hover:text-black">
              Most Viewed
            </button>
          </div>
        </div>

        {/* PROJECT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {projects.map((project) => (
            <article
              key={project.id}
              className={`group cursor-pointer ${
                project.size === "large" ? "md:col-span-2" : ""
              }`}
            >

              {/* Project Visual */}
              <div
                className={`${project.color} ${
                  project.size === "large"
                    ? "aspect-[2/1]"
                    : "aspect-[4/3]"
                } border border-black overflow-hidden relative`}
              >

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl md:text-7xl font-black tracking-tighter opacity-20 group-hover:scale-110 transition-transform duration-500">
                    {String(project.id).padStart(2, "0")}
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/90 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 md:p-10 flex flex-col justify-between">

                  <div className="flex justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest">
                      Project / 0{project.id}
                    </span>

                    <span className="font-mono text-[10px]">
                      ↗
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-mono uppercase text-neutral-400 mb-2">
                      {project.category}
                    </p>

                    <h3 className="text-2xl md:text-4xl font-bold">
                      {project.title}
                    </h3>

                    <p className="text-sm text-neutral-300 mt-3 max-w-lg">
                      {project.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div className="flex justify-between items-start pt-4 pb-2">
                <div>
                  <h3 className="font-bold text-base">
                    {project.title}
                  </h3>

                  <p className="text-xs text-neutral-500 font-mono uppercase mt-1">
                    {project.category}
                  </p>
                </div>

                <span className="text-xs font-mono">
                  ♡ 24
                </span>
              </div>
            </article>
          ))}

        </div>

        {/* ABOUT */}
        <section className="mt-24 border-t border-black pt-10">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                About
              </p>
              <h2 className="text-2xl font-bold mt-2">
                A little about me.
              </h2>
            </div>

            <div className="md:col-span-2 max-w-2xl">
              <p className="text-base leading-7 text-neutral-700">
                I'm a creative developer interested in building useful,
                thoughtful and visually interesting digital products. I enjoy
                working across design and technology and turning rough ideas
                into things people can actually use.
              </p>

              <p className="text-base leading-7 text-neutral-700 mt-5">
                Currently exploring product design, frontend development,
                creative technology and collaborative projects.
              </p>
            </div>

          </div>
        </section>

        {/* EXPERIENCE */}
        <section className="mt-20 border-t border-black pt-10">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                Background
              </p>

              <h2 className="text-2xl font-bold mt-2">
                Experience
              </h2>
            </div>

            <div className="md:col-span-2">

              <div className="border-b border-neutral-300 pb-6 mb-6">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-bold">
                      Freelance Designer / Developer
                    </h3>

                    <p className="text-xs font-mono text-neutral-500 uppercase mt-1">
                      Independent
                    </p>
                  </div>

                  <span className="font-mono text-xs text-neutral-500">
                    2025 — Present
                  </span>
                </div>
              </div>

              <div className="border-b border-neutral-300 pb-6">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-bold">
                      Student Creator
                    </h3>

                    <p className="text-xs font-mono text-neutral-500 uppercase mt-1">
                      ProjeX
                    </p>
                  </div>

                  <span className="font-mono text-xs text-neutral-500">
                    2024 — Present
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ACTIVITY */}
        <section className="mt-20 border-t border-black pt-10">

          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                ProjeX Activity
              </p>

              <h2 className="text-2xl font-bold mt-2">
                Applications & Submissions
              </h2>
            </div>

            <span className="text-xs font-mono text-neutral-500">
              3 ACTIVE
            </span>
          </div>

          <div className="space-y-0 border-t border-black">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="py-6 border-b border-black flex flex-col md:flex-row md:items-center justify-between gap-5"
              >

                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-500">
                    Application 0{item}
                  </span>

                  <h3 className="font-bold text-lg mt-1">
                    Project Artifact v{item}.0
                  </h3>

                  <p className="text-sm text-neutral-500 mt-1">
                    Application submitted · Pending review
                  </p>
                </div>

                <button className="text-xs font-mono uppercase underline underline-offset-4">
                  View Application →
                </button>

              </div>
            ))}

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-black px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
        <span>ProjeX / Creator Profile</span>
        <span>Built for people who build things.</span>
      </footer>

    </div>
  );
}
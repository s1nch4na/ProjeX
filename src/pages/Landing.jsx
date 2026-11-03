import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import { apiRequest } from "../utils/api";

export default function Landing() {
  const navigate = useNavigate();
  const projectRef = useRef(null);
  const profileRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      try {
        const response = await apiRequest("/api/projects");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Could not load projects.");
        }

        if (!cancelled) setProjects(data.projects || []);
      } catch (error) {
        if (!cancelled) {
          setProjectsError(error.message || "Could not load projects.");
        }
      } finally {
        if (!cancelled) setProjectsLoading(false);
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  const handlePostProject = () => {
    let user = null;

    try {
      user = JSON.parse(localStorage.getItem("projex_user") || "null");
    } catch (error) {
      console.error("Could not read ProjeX user:", error);
    }

    if (user?.role === "investor") {
      navigate("/project-owner/post");
      return;
    }

    if (user?.role === "student") {
      alert("Posting a project requires a Project Owner account.");
      return;
    }

    navigate("/login", {
      state: {
        authRole: "investor",
        returnTo: "/project-owner/post",
      },
    });
  };

  const scroll = (ref, dir) => {
    if (!ref.current) return;
    const amount = 400;
    ref.current.scrollLeft += dir === "left" ? -amount : amount;
  };

  return (
    <div className="min-h-screen bg-[#F3F3EF] text-[#0A0A0A] font-sans selection:bg-black selection:text-white">

      {/* HERO SECTION */}
      <section className="border-b border-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
          <div className="md:col-span-8">
            <div className="inline-block border border-black px-3 py-1 text-xs uppercase tracking-widest mb-6 font-mono">
              [ Platform Registry 2026 ]
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] uppercase">
              Build real projects. <br />
              <span className="underline decoration-2 underline-offset-8">Not just resumes.</span>
            </h1>
          </div>
          
          <div className="md:col-span-4 flex flex-col justify-between h-full">
            <p className="text-sm md:text-base text-neutral-700 leading-relaxed mb-8">
              ProjeX connects students directly with startups and businesses looking for concrete work execution instead of paper credentials.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/student"
                className="px-6 py-3 bg-black text-white text-center font-medium hover:bg-neutral-800 transition-colors rounded-none"
              >
                Explore Projects →
              </Link>
              <button
                type="button"
                onClick={handlePostProject}
                className="px-6 py-3 border border-black text-center font-medium hover:bg-black hover:text-white transition-colors rounded-none"
              >
                Post a Project
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS ROW */}
      <section className="border-b border-black grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black">
        <div className="px-12 py-8 flex flex-col justify-between">
          <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">01 / Active Pool</span>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight">STUDENTS</h3>
            <p className="text-sm text-neutral-600 mt-1">Build with real opportunities</p>
          </div>
        </div>
        <div className="px-12 py-8 flex flex-col justify-between">
          <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">02 / Execution</span>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight">PROJECTS</h3>
            <p className="text-sm text-neutral-600 mt-1">Browse live project openings</p>
          </div>
        </div>
        <div className="px-12 py-8 flex flex-col justify-between">
          <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">03 / Partners</span>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight">OWNERS</h3>
            <p className="text-sm text-neutral-600 mt-1">Connect with project owners</p>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="border-b border-black py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">Catalog</span>
              <h2 className="text-3xl font-bold tracking-tight mt-1">Featured Openings</h2>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => scroll(projectRef, "left")}
                className="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                aria-label="Scroll left"
              >
                ←
              </button>
              <button
                onClick={() => scroll(projectRef, "right")}
                className="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                aria-label="Scroll right"
              >
                →
              </button>
            </div>
          </div>

          <div
            ref={projectRef}
            className="flex gap-6 overflow-x-auto no-scrollbar pb-4"
          >
            {projectsLoading && (
              <p className="border border-black bg-white p-6 text-sm">
                Loading project openings...
              </p>
            )}
            {!projectsLoading && projectsError && (
              <p role="alert" className="border border-red-600 bg-white p-6 text-sm text-red-700">
                {projectsError}
              </p>
            )}
            {!projectsLoading && !projectsError && projects.length === 0 && (
              <p className="border border-black bg-white p-6 text-sm">
                No project openings are available yet.
              </p>
            )}
            {!projectsLoading && !projectsError && projects.map((project) => (
              <div key={project.id} className="min-w-[320px] max-w-[320px] flex-shrink-0">
                <ProjectCard
                  id={project.id}
                  title={project.title}
                  meta={project.meta || project.project_type || "General"}
                  price={project.price}
                  image={project.image_url}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR CREATORS */}
      <section className="border-b border-black py-20 bg-[#EFECE6]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">Directory</span>
              <h2 className="text-3xl font-bold tracking-tight mt-1">Top Student Talent</h2>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => scroll(profileRef, "left")}
                className="w-10 h-10 border border-black bg-[#F3F3EF] flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                aria-label="Scroll left"
              >
                ←
              </button>
              <button
                onClick={() => scroll(profileRef, "right")}
                className="w-10 h-10 border border-black bg-[#F3F3EF] flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                aria-label="Scroll right"
              >
                →
              </button>
            </div>
          </div>

          <div
            ref={profileRef}
            className="flex gap-6 overflow-x-auto no-scrollbar pb-4"
          >
            <div className="border border-black bg-white p-6 text-sm max-w-xl">
              Student profiles become available through project applications and
              authenticated collaboration. There is no public talent directory yet.
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight uppercase mb-6">
            Ready to ship production work?
          </h2>
          <p className="text-neutral-600 mb-10 max-w-lg mx-auto">
            Bypass simulation exercises. Build real systems, write production code, and scale with active companies.
          </p>

          <Link
            to="/student"
            className="inline-block px-8 py-4 bg-black text-white font-medium hover:bg-neutral-800 transition-colors rounded-none"
          >
            Get Started Now →
          </Link>
        </div>
      </section>

    </div>
  );
}
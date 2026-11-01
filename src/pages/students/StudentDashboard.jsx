
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProjectCard from "../../components/ProjectCard";
import HorizontalScroller from "../../components/HorizontalScroller";

import StudentChallenges from "./StudentChallenges";
import StudentChat from "./StudentChat";
import { apiRequest } from "../../utils/api";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("projects");

  // Temporary student profile data
  const studentProfile = {
    id: 1,
    name: "Alex Rivera",
    email: "alex.rivera@jainuniversity.ac.in",
    role: "Full-Stack Builder & UI Enthusiast",
    bio: "Computer Science student specializing in React, full-stack architectures, and modern web animations.",
    avatar: "https://placehold.co/200x200",
  };

  // Live projects from the backend
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState("");

  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [applicationsError, setApplicationsError] = useState("");
  const [applicationsRetry, setApplicationsRetry] = useState(0);
  const [expandedApplicationId, setExpandedApplicationId] = useState(null);

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      try {
        setProjectsLoading(true);
        setProjectsError("");

        const response = await apiRequest("/api/projects");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Could not load projects."
          );
        }

        // Convert database fields into the format ProjectCard expects.
        const formattedProjects = (data.projects || []).map(
          (project) => ({
            ...project,
            meta:
              project.meta ||
              project.project_type ||
              "General",
            image: project.image_url || "",
            datePosted: project.created_at,
          })
        );

        if (!cancelled) {
          setProjects(formattedProjects);
        }
      } catch (error) {
        if (!cancelled) {
          setProjectsError(
            error.message || "Could not load projects."
          );
        }
      } finally {
        if (!cancelled) {
          setProjectsLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadApplications() {
      try {
        setApplicationsLoading(true);
        setApplicationsError("");

        const response = await apiRequest("/api/student/applications");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Could not load your applications."
          );
        }

        if (!cancelled) {
          setApplications(data.applications || []);
        }
      } catch (error) {
        if (!cancelled) {
          setApplicationsError(
            error.message || "Could not load your applications."
          );
        }
      } finally {
        if (!cancelled) {
          setApplicationsLoading(false);
        }
      }
    }

    loadApplications();

    return () => {
      cancelled = true;
    };
  }, [applicationsRetry]);

  // Search + sorting
  const visible = useMemo(() => {
    let list = [...projects];

    if (query.trim()) {
      const q = query.toLowerCase().trim();

      list = list.filter(
        (project) =>
          project.title?.toLowerCase().includes(q) ||
          project.meta?.toLowerCase().includes(q) ||
          project.description?.toLowerCase().includes(q) ||
          project.project_type?.toLowerCase().includes(q)
      );
    }

    if (sort === "newest") {
      list.sort(
        (a, b) =>
          new Date(b.datePosted || 0) -
          new Date(a.datePosted || 0)
      );
    } else if (sort === "price") {
      list.sort(
        (a, b) =>
          Number(b.price || 0) - Number(a.price || 0)
      );
    }

    return list;
  }, [projects, query, sort]);

  return (
    <div className="min-h-screen bg-[#F3F3EF] text-[#0A0A0A] font-sans px-6 md:px-12 py-12 selection:bg-black selection:text-white">

      {/* TOP HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 pb-4 border-b border-black gap-4">

        <div>
          <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">
            Student Control Center
          </span>

          <h2 className="text-3xl font-bold tracking-tight uppercase mt-1">
            Workspace
          </h2>
        </div>

        {/* Navigation + Profile */}
        <div className="flex items-center gap-4">

          <div className="flex gap-1 bg-white border border-black p-1">

            <button
              onClick={() => setActiveTab("projects")}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === "projects"
                  ? "bg-black text-white"
                  : "hover:bg-neutral-100 text-black"
              }`}
            >
              Marketplace
            </button>

            <button
              onClick={() => setActiveTab("challenges")}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === "challenges"
                  ? "bg-black text-white"
                  : "hover:bg-neutral-100 text-black"
              }`}
            >
              Challenges
            </button>

            <button
              onClick={() => setActiveTab("chat")}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === "chat"
                  ? "bg-black text-white"
                  : "hover:bg-neutral-100 text-black"
              }`}
            >
              Messages
            </button>

          </div>

          <button
            onClick={() => navigate(`/creators/${studentProfile.id}`)}
            className="w-10 h-10 rounded-full border border-black overflow-hidden bg-white hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center shadow-sm"
            title="View Profile"
          >
            <img
              src={studentProfile.avatar}
              alt={studentProfile.name}
              className="w-full h-full object-cover"
            />
          </button>

        </div>
      </div>

      {/* MARKETPLACE */}
      {activeTab === "projects" && (
        <div>

          {/* APPLICATION TRACKING */}
          <section className="mb-14" aria-labelledby="applications-heading">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-6">
              <div>
                <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">
                  Your activity
                </span>
                <h3
                  id="applications-heading"
                  className="text-xl font-bold uppercase tracking-tight mt-1"
                >
                  Application Tracking
                </h3>
              </div>
              {!applicationsLoading && !applicationsError && (
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                  {applications.length} submitted
                </span>
              )}
            </div>

            {applicationsLoading && (
              <div className="border border-black bg-white p-8 text-center">
                <p className="font-mono text-sm uppercase tracking-wider">
                  Loading applications...
                </p>
              </div>
            )}

            {!applicationsLoading && applicationsError && (
              <div className="border border-black bg-white p-8 text-center">
                <p role="alert" className="font-mono text-sm mb-4">
                  {applicationsError}
                </p>
                <button
                  type="button"
                  onClick={() => setApplicationsRetry((value) => value + 1)}
                  className="border border-black bg-black text-white px-5 py-2 font-mono text-xs uppercase tracking-wider hover:bg-neutral-800"
                >
                  Retry
                </button>
              </div>
            )}

            {!applicationsLoading &&
              !applicationsError &&
              applications.length === 0 && (
                <div className="border border-black bg-white p-8 text-center">
                  <p className="font-mono text-sm uppercase tracking-wider text-neutral-500 mb-4">
                    You have not submitted any applications yet.
                  </p>
                  <a
                    href="#marketplace"
                    className="inline-block border border-black bg-black text-white px-5 py-2 font-mono text-xs uppercase tracking-wider hover:bg-neutral-800"
                  >
                    Browse projects →
                  </a>
                </div>
              )}

            {!applicationsLoading &&
              !applicationsError &&
              applications.length > 0 && (
                <div className="space-y-4">
                  {applications.map((application) => {
                    const isExpanded =
                      expandedApplicationId === application.application_id;
                    const status = application.status || "Applied";
                    const statusStyle =
                      status === "Accepted"
                        ? "bg-green-100 text-green-800"
                        : status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800";

                    return (
                      <article
                        key={application.application_id}
                        className="border border-black bg-white"
                      >
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          onClick={() =>
                            setExpandedApplicationId(
                              isExpanded
                                ? null
                                : application.application_id
                            )
                          }
                          className="w-full text-left p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                        >
                          <div className="min-w-0">
                            <h4 className="font-bold uppercase tracking-tight truncate">
                              {application.project_title ||
                                "Untitled project"}
                            </h4>
                            <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                              {application.cover_note ||
                                "No cover note provided."}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span
                              className={`px-2 py-1 text-[10px] font-mono uppercase ${statusStyle}`}
                            >
                              {status}
                            </span>
                            <span className="text-[10px] font-mono uppercase">
                              {isExpanded ? "Hide" : "Details"}
                            </span>
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="border-t border-neutral-300 p-4 text-sm">
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <dt className="text-[10px] font-mono uppercase text-neutral-500">
                                  Application type
                                </dt>
                                <dd>{application.application_type || "Not specified"}</dd>
                              </div>
                              <div>
                                <dt className="text-[10px] font-mono uppercase text-neutral-500">
                                  Submitted
                                </dt>
                                <dd>
                                  {application.created_at
                                    ? new Date(
                                        application.created_at
                                      ).toLocaleDateString()
                                    : "Date unavailable"}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-[10px] font-mono uppercase text-neutral-500">
                                  Project type
                                </dt>
                                <dd>
                                  {application.project_type ||
                                    application.project_meta ||
                                    "General"}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-[10px] font-mono uppercase text-neutral-500">
                                  Current status
                                </dt>
                                <dd>{status}</dd>
                              </div>
                            </dl>

                            <div className="mt-4">
                              <dt className="text-[10px] font-mono uppercase text-neutral-500">
                                Team members
                              </dt>
                              <dd className="whitespace-pre-wrap">
                                {application.team_members || "None"}
                              </dd>
                            </div>

                            <div className="mt-4">
                              <dt className="text-[10px] font-mono uppercase text-neutral-500">
                                Full cover note
                              </dt>
                              <dd className="mt-1 whitespace-pre-wrap">
                                {application.cover_note ||
                                  "No cover note provided."}
                              </dd>
                            </div>

                            <div className="mt-4 border-t border-neutral-200 pt-4">
                              <dt className="text-[10px] font-mono uppercase text-neutral-500">
                                Project information
                              </dt>
                              <dd className="mt-1">
                                <p>{application.project_description || "No description provided."}</p>
                                <p className="mt-2 text-xs text-neutral-600">
                                  {application.project_deadline
                                    ? `Deadline: ${application.project_deadline}`
                                    : "Deadline unavailable"}
                                  {application.project_price != null &&
                                    ` · Budget: ₹${application.project_price}`}
                                </p>
                              </dd>
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
          </section>

          {/* Search + Sort */}
          <div
            id="marketplace"
            className="flex flex-col sm:flex-row gap-3 mb-10 items-stretch sm:items-center"
          >

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2.5 bg-white border border-black text-xs font-mono uppercase tracking-wider rounded-none focus:outline-none cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="price">Sort: Highest Price</option>
            </select>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="px-4 py-2.5 bg-white border border-black text-xs font-mono uppercase tracking-wider flex-1 placeholder-neutral-500 rounded-none focus:outline-none"
              placeholder="Search by keyword or city..."
            />

          </div>

          {/* Loading State */}
          {projectsLoading && (
            <div className="border border-black bg-white p-10 mb-10 text-center">
              <p className="font-mono text-sm uppercase tracking-wider">
                Loading projects...
              </p>
            </div>
          )}

          {/* Error State */}
          {!projectsLoading && projectsError && (
            <div className="border border-black bg-white p-10 mb-10 text-center">
              <p
                role="alert"
                className="font-mono text-sm mb-4"
              >
                {projectsError}
              </p>

              <button
                onClick={() => window.location.reload()}
                className="border border-black bg-black text-white px-5 py-2 font-mono text-xs uppercase tracking-wider hover:bg-neutral-800"
              >
                Retry
              </button>
            </div>
          )}

          {/* Project Sections */}
          {!projectsLoading && !projectsError && (
            <>
              {/* FEATURED OPENINGS */}
              <div className="mb-14">

                <div className="flex justify-between items-end mb-6">
                  <h3 className="text-xl font-bold uppercase tracking-tight">
                    Featured Openings
                  </h3>

                  <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                    [ Top Tier ]
                  </span>
                </div>

                {projects.length > 0 ? (
                  <div className="border border-black bg-white p-6">
                    <HorizontalScroller>
                      {projects.slice(0, 18).map((project) => (
                        <div
                          key={project.id}
                          className="min-w-[320px]"
                        >
                          <ProjectCard {...project} />
                        </div>
                      ))}
                    </HorizontalScroller>
                  </div>
                ) : (
                  <div className="border border-black bg-white p-8 text-center">
                    <p className="font-mono text-sm uppercase tracking-wider text-neutral-500">
                      No projects have been posted yet.
                    </p>
                  </div>
                )}

              </div>

              {/* ALL LISTINGS */}
              <div>

                <div className="flex justify-between items-end mb-6">
                  <h3 className="text-xl font-bold uppercase tracking-tight">
                    All Listings
                  </h3>

                  <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                    Showing {visible.length} results
                  </span>
                </div>

                {visible.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visible.map((project) => (
                      <ProjectCard
                        key={project.id}
                        {...project}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="border border-black bg-white p-10 text-center">
                    <p className="font-mono text-sm uppercase tracking-wider text-neutral-500">
                      {projects.length === 0
                        ? "No projects found"
                        : "No projects match your search"}
                    </p>
                  </div>
                )}

              </div>
            </>
          )}

        </div>
      )}

      {/* CHALLENGES */}
      {activeTab === "challenges" && (
        <div className="bg-white border border-black p-6">
          <StudentChallenges />
        </div>
      )}

      {/* MESSAGES */}
      {activeTab === "chat" && (
        <div className="bg-white border border-black p-6">
          <StudentChat />
        </div>
      )}

    </div>
  );
}
import React, { useEffect, useMemo, useState } from "react";
import ProjectCard from "../../components/ProjectCard";
import { apiRequest } from "../../utils/api";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("projex_user") || "null");
  } catch {
    return null;
  }
}

async function readResponse(response, fallbackMessage) {
  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(
      response.ok
        ? "The server returned an invalid response."
        : fallbackMessage
    );
  }

  if (!response.ok || !data?.success) {
    throw new Error(data?.error || fallbackMessage);
  }

  return data;
}

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString();
}

function statusClasses(status) {
  if (status === "Accepted") return "bg-green-100 text-green-800";
  if (status === "Rejected") return "bg-red-100 text-red-800";
  return "bg-yellow-100 text-yellow-800";
}

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadOwnerData() {
      try {
        setLoading(true);
        setError("");

        const storedUser = getStoredUser();
        const ownerId = storedUser?.id ?? storedUser?.user?.id;

        if (!ownerId) {
          throw new Error("Your login session was not found. Please log in again.");
        }

        const [projectsResponse, applicationsResponse] = await Promise.all([
          apiRequest("/api/projects"),
          apiRequest("/api/owner/applications"),
        ]);

        const projectsData = await readResponse(
          projectsResponse,
          "Could not load projects."
        );
        const applicationsData = await readResponse(
          applicationsResponse,
          "Could not load applications."
        );

        if (!cancelled) {
          setProjects(
            (projectsData.projects || []).filter(
              (project) => String(project.user_id) === String(ownerId)
            )
          );
          setApplications(applicationsData.applications || []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Could not load your projects.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadOwnerData();

    return () => {
      cancelled = true;
    };
  }, []);

  const projectIds = useMemo(
    () => new Set(projects.map((project) => String(project.id))),
    [projects]
  );

  const visibleApplications = useMemo(
    () =>
      applications.filter((application) =>
        projectIds.has(String(application.project_id))
      ),
    [applications, projectIds]
  );

  const updateApplicationStatus = async (applicationId, status) => {
    setFeedback("");
    setUpdatingId(applicationId);

    try {
      const response = await apiRequest(
        `/api/owner/applications/${encodeURIComponent(applicationId)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      const data = await readResponse(
        response,
        "Could not update the application status."
      );

      setApplications((current) =>
        current.map((application) =>
          application.application_id === applicationId
            ? { ...application, ...data.application }
            : application
        )
      );
      setFeedback(`Application ${status.toLowerCase()} successfully.`);
    } catch (updateError) {
      setFeedback(updateError.message || "Could not update the application status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F3EF] text-[#0A0A0A] font-sans px-6 md:px-12 py-10">
      <div className="mb-8 border-b border-black pb-4">
        <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">
          Registry / Projects
        </span>
        <h1 className="text-3xl font-bold tracking-tight uppercase mt-1">
          My Projects
        </h1>
      </div>

      {feedback && (
        <p role="status" className="mb-6 border border-black bg-white p-3 text-sm">
          {feedback}
        </p>
      )}

      {loading && (
        <p className="border border-black bg-white p-6 text-sm font-mono uppercase">
          Loading your projects...
        </p>
      )}

      {!loading && error && (
        <p role="alert" className="border border-red-600 bg-white p-6 text-sm text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <section aria-labelledby="projects-heading" className="mb-12">
            <div className="flex items-end justify-between mb-5">
              <h2 id="projects-heading" className="text-xl font-bold uppercase tracking-tight">
                Posted Projects
              </h2>
              <span className="text-xs font-mono uppercase text-neutral-500">
                {projects.length} total
              </span>
            </div>

            {projects.length === 0 ? (
              <div className="border border-black bg-white p-6 text-sm">
                You have not posted any projects yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    meta={project.meta || project.project_type || "General"}
                    price={project.price}
                    image={project.image_url}
                  />
                ))}
              </div>
            )}
          </section>

          <section aria-labelledby="applications-heading">
            <div className="flex items-end justify-between mb-5">
              <h2 id="applications-heading" className="text-xl font-bold uppercase tracking-tight">
                Applications
              </h2>
              <span className="text-xs font-mono uppercase text-neutral-500">
                {visibleApplications.length} received
              </span>
            </div>

            {visibleApplications.length === 0 ? (
              <div className="border border-black bg-white p-6 text-sm">
                No applications have been submitted to your projects.
              </div>
            ) : (
              <div className="space-y-4">
                {visibleApplications.map((application) => {
                  const isExpanded = expandedId === application.application_id;
                  const canRespond = application.status === "Applied";
                  const isUpdating = updatingId === application.application_id;

                  return (
                    <article
                      key={application.application_id}
                      className="border border-black bg-white"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : application.application_id)
                        }
                        className="w-full text-left p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                        aria-expanded={isExpanded}
                      >
                        <div>
                          <h3 className="font-bold uppercase tracking-tight">
                            {application.project_title || "Untitled project"}
                          </h3>
                          <p className="text-sm mt-1">{application.user_email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 text-[10px] font-mono uppercase ${statusClasses(application.status)}`}>
                            {application.status || "Applied"}
                          </span>
                          <span className="text-xs font-mono uppercase">
                            {isExpanded ? "Hide details" : "View details"}
                          </span>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-neutral-300 p-4 text-sm">
                          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <dt className="text-[10px] font-mono uppercase text-neutral-500">
                                Applicant
                              </dt>
                              <dd>{application.user_email}</dd>
                            </div>
                            <div>
                              <dt className="text-[10px] font-mono uppercase text-neutral-500">
                                Submitted
                              </dt>
                              <dd>{formatDate(application.created_at)}</dd>
                            </div>
                            <div>
                              <dt className="text-[10px] font-mono uppercase text-neutral-500">
                                Application type
                              </dt>
                              <dd>{application.application_type || "Not specified"}</dd>
                            </div>
                            <div>
                              <dt className="text-[10px] font-mono uppercase text-neutral-500">
                                Team members
                              </dt>
                              <dd className="whitespace-pre-wrap">
                                {application.team_members || "None"}
                              </dd>
                            </div>
                          </dl>
                          <div className="mt-4">
                            <dt className="text-[10px] font-mono uppercase text-neutral-500">
                              Cover note
                            </dt>
                            <p className="mt-1 whitespace-pre-wrap">
                              {application.cover_note || "No cover note provided."}
                            </p>
                          </div>

                          {canRespond && (
                            <div className="mt-5 flex flex-wrap gap-3">
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() =>
                                  updateApplicationStatus(
                                    application.application_id,
                                    "Accepted"
                                  )
                                }
                                className="px-4 py-2 bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50"
                              >
                                {isUpdating ? "Updating..." : "Accept"}
                              </button>
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() =>
                                  updateApplicationStatus(
                                    application.application_id,
                                    "Rejected"
                                  )
                                }
                                className="px-4 py-2 border border-black text-xs font-mono uppercase tracking-wider hover:bg-neutral-100 disabled:opacity-50"
                              >
                                {isUpdating ? "Updating..." : "Reject"}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

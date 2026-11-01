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
  return "bg-blue-100 text-blue-800";
}

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedProjectId, setExpandedProjectId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadOwnerData() {
      try {
        setLoading(true);
        setError("");

        const storedUser = getStoredUser();
        const ownerId = storedUser?.id ?? storedUser?.user?.id;

        if (!ownerId) {
          throw new Error(
            "Your login session was not found. Please log in again."
          );
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
          const uniqueProjects = new Map();

          (projectsData.projects || [])
            .filter(
              (project) => String(project.user_id) === String(ownerId)
            )
            .forEach((project) => {
              uniqueProjects.set(String(project.id), project);
            });

          setProjects([...uniqueProjects.values()]);
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

  const applicationsByProject = useMemo(() => {
    const grouped = new Map();

    applications.forEach((application) => {
      const projectId = String(application.project_id);
      const projectApplications = grouped.get(projectId) || [];
      projectApplications.push(application);
      grouped.set(projectId, projectApplications);
    });

    return grouped;
  }, [applications]);

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

      const applicationsResponse = await apiRequest(
        "/api/owner/applications"
      );
      const applicationsData = await readResponse(
        applicationsResponse,
        "Application status was updated, but applications could not be refreshed."
      );
      setApplications(applicationsData.applications || []);
      setFeedback(`Application ${status.toLowerCase()} successfully.`);
    } catch (updateError) {
      setFeedback(
        updateError.message || "Could not update the application status."
      );
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
          Loading projects and applications...
        </p>
      )}

      {!loading && error && (
        <p
          role="alert"
          className="border border-red-600 bg-white p-6 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {!loading && !error && (
        <section aria-labelledby="projects-heading">
          <div className="flex items-end justify-between mb-5">
            <h2
              id="projects-heading"
              className="text-xl font-bold uppercase tracking-tight"
            >
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
            <div className="space-y-6">
              {projects.map((project) => {
                const projectId = String(project.id);
                const projectApplications =
                  applicationsByProject.get(projectId) || [];
                const isExpanded = expandedProjectId === projectId;
                const toggleProjectApplications = (event) => {
                  if (event.target.closest("a, button")) return;
                  setExpandedProjectId(isExpanded ? null : projectId);
                };

                return (
                  <article
                    key={projectId}
                    className="border border-black bg-white"
                    onClick={toggleProjectApplications}
                  >
                    <div className="p-4">
                      <ProjectCard
                        id={project.id}
                        title={project.title}
                        meta={project.meta || project.project_type || "General"}
                        price={project.price}
                        image={project.image_url}
                      />
                    </div>

                    <div className="border-t border-black">
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        onClick={() =>
                          setExpandedProjectId(isExpanded ? null : projectId)
                        }
                        className="w-full px-4 py-3 flex justify-between items-center text-left hover:bg-neutral-100"
                      >
                        <span className="text-xs font-mono uppercase tracking-wider">
                          Applications ({projectApplications.length})
                        </span>
                        <span className="text-xs font-mono uppercase">
                          {isExpanded ? "Hide" : "Expand"}
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-neutral-300 p-4">
                          {projectApplications.length === 0 ? (
                            <p className="text-sm text-neutral-600">
                              No applications received yet.
                            </p>
                          ) : (
                            <div className="space-y-4">
                              {projectApplications.map((application) => {
                                const canRespond =
                                  application.status === "Applied";
                                const isUpdating =
                                  updatingId === application.application_id;

                                return (
                                  <div
                                    key={application.application_id}
                                    className="border border-neutral-300 p-4"
                                  >
                                    <div className="flex flex-col md:flex-row md:justify-between gap-3">
                                      <div>
                                        <p className="font-bold">
                                          Student name unavailable
                                        </p>
                                        <p className="text-sm">
                                          {application.user_email}
                                        </p>
                                        <p className="text-xs text-neutral-500 mt-1">
                                          Submitted{" "}
                                          {formatDate(application.created_at)}
                                        </p>
                                      </div>
                                      <span
                                        className={`self-start px-2 py-1 text-[10px] font-mono uppercase ${statusClasses(
                                          application.status
                                        )}`}
                                      >
                                        {application.status || "Applied"}
                                      </span>
                                    </div>

                                    <dl className="mt-4 space-y-3 text-sm">
                                      <div>
                                        <dt className="text-[10px] font-mono uppercase text-neutral-500">
                                          Application type
                                        </dt>
                                        <dd>
                                          {application.application_type || "solo"}
                                        </dd>
                                      </div>
                                      <div>
                                        <dt className="text-[10px] font-mono uppercase text-neutral-500">
                                          Cover note
                                        </dt>
                                        <dd className="mt-1 whitespace-pre-wrap">
                                          {application.cover_note ||
                                            "No cover note provided."}
                                        </dd>
                                      </div>
                                    </dl>

                                    {canRespond && (
                                      <div className="mt-4 flex flex-wrap gap-3">
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
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

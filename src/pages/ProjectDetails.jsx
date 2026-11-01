import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectApplicationModal from "../components/ProjectApplicationModal";
import { apiRequest } from "../utils/api";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [ownerApplications, setOwnerApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState("");
  const [applicationFeedback, setApplicationFeedback] = useState("");
  const [updatingApplicationId, setUpdatingApplicationId] = useState(null);

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

    async function loadProject() {
      setIsLoading(true);
      setError("");
      setProject(null);
      setIsApplyModalOpen(false);

      try {
        const response = await apiRequest(
          `/api/projects/${encodeURIComponent(id)}`
        );
        const data = await response.json();

        if (!response.ok || !data.success || !data.project) {
          throw new Error(data.error || "Could not load this project.");
        }

        if (!cancelled) {
          setProject(data.project);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError.message || "Could not load this project."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadProject();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (
      !project ||
      currentUser?.role !== "investor" ||
      String(project.user_id) !== String(currentUser.id)
    ) {
      setOwnerApplications([]);
      setApplicationsError("");
      setApplicationsLoading(false);
      return undefined;
    }

    let cancelled = false;

    async function loadOwnerApplications() {
      try {
        setApplicationsLoading(true);
        setApplicationsError("");

        const response = await apiRequest("/api/owner/applications");
        const text = await response.text();
        let data;

        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          throw new Error(
            response.ok
              ? "The server returned an invalid response."
              : "Could not load applications."
          );
        }

        if (!response.ok || !data?.success) {
          throw new Error(data?.error || "Could not load applications.");
        }

        const projectApplications = (data.applications || []).filter(
          (application) =>
            String(application.project_id) === String(project.id)
        );

        if (!cancelled) {
          setOwnerApplications(projectApplications);
        }
      } catch (loadError) {
        if (!cancelled) {
          setApplicationsError(
            loadError.message || "Could not load applications."
          );
        }
      } finally {
        if (!cancelled) {
          setApplicationsLoading(false);
        }
      }
    }

    loadOwnerApplications();

    return () => {
      cancelled = true;
    };
  }, [project, currentUser]);

  const updateApplicationStatus = async (applicationId, status) => {
    setApplicationFeedback("");
    setUpdatingApplicationId(applicationId);

    try {
      const response = await apiRequest(
        `/api/owner/applications/${encodeURIComponent(applicationId)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      const text = await response.text();
      let data;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        throw new Error(
          response.ok
            ? "The server returned an invalid response."
            : "Could not update application status."
        );
      }

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "Could not update application status.");
      }

      const applicationsResponse = await apiRequest(
        "/api/owner/applications"
      );
      const applicationsText = await applicationsResponse.text();
      let applicationsData;

      try {
        applicationsData = applicationsText
          ? JSON.parse(applicationsText)
          : null;
      } catch {
        throw new Error(
          applicationsResponse.ok
            ? "The server returned an invalid response."
            : "Application status updated, but applications could not be refreshed."
        );
      }

      if (!applicationsResponse.ok || !applicationsData?.success) {
        throw new Error(
          applicationsData?.error ||
            "Application status updated, but applications could not be refreshed."
        );
      }

      setOwnerApplications(
        (applicationsData.applications || []).filter(
          (application) =>
            String(application.project_id) === String(project.id)
        )
      );
      setApplicationFeedback(`Application ${status.toLowerCase()} successfully.`);
    } catch (updateError) {
      setApplicationFeedback(
        updateError.message || "Could not update application status."
      );
    } finally {
      setUpdatingApplicationId(null);
    }
  };

  const projectImage =
    project?.image_url ||
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-mono">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => navigate(-1)}
      />

      <div className="relative bg-white border-2 border-black rounded-none w-[90%] max-w-5xl max-h-[90vh] overflow-y-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-black hover:bg-black hover:text-white border border-black px-2 py-1 text-sm transition cursor-pointer"
        >
          ✕
        </button>

        {isLoading && (
          <div className="py-16 text-center">
            <p className="text-sm uppercase tracking-wider">
              Loading project...
            </p>
          </div>
        )}

        {!isLoading && error && (
          <div className="py-16 text-center">
            <p role="alert" className="text-sm uppercase tracking-wider">
              {error}
            </p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-6 border border-black bg-black text-white px-5 py-2 text-xs uppercase tracking-wider"
            >
              Go Back
            </button>
          </div>
        )}

        {!isLoading && !error && project && (
          <>
            <div className="w-full h-56 bg-[#F3F3EF] border-2 border-black mb-8 overflow-hidden">
              <img
                src={projectImage}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <span className="text-xs uppercase bg-black text-white px-2 py-0.5">
                  {project.project_type || project.meta || "General"}
                </span>
                <h1 className="text-2xl font-bold uppercase tracking-tight">
                  {project.title}
                </h1>
                <p className="text-sm font-bold text-neutral-800">
                  {project.description}
                </p>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  This project is seeking student contributors for the posted scope.
                </p>
              </div>

              <div className="border-2 border-black p-6 bg-[#f4f4f0] space-y-6 flex flex-col justify-between">
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-neutral-500 uppercase block font-bold">
                      Budget
                    </span>
                    <span className="text-xl font-bold text-black">
                      ₹{project.price}
                    </span>
                  </div>

                  <div>
                    <span className="text-neutral-500 uppercase block font-bold">
                      Deadline
                    </span>
                    <span className="text-black">{project.deadline}</span>
                  </div>

                  <div>
                    <span className="text-neutral-500 uppercase block font-bold">
                      Posted On
                    </span>
                    <span className="text-black">{project.created_at}</span>
                  </div>

                  <div className="pt-2 border-t border-neutral-300">
                    <span className="text-neutral-500 uppercase block font-bold">
                      Posted By
                    </span>
                    <span className="font-bold text-black block">
                      Project Owner #{project.user_id}
                    </span>
                  </div>
                </div>

                {currentUser?.role === "student" && (
                  <button
                    onClick={() => setIsApplyModalOpen(true)}
                    className="w-full bg-black text-white py-3 text-xs uppercase tracking-widest font-bold border-2 border-black hover:bg-neutral-800 transition cursor-pointer text-center mt-6"
                  >
                    Apply For Project →
                  </button>
                )}
              </div>
            </div>

            {currentUser?.role === "investor" &&
              String(project.user_id) === String(currentUser.id) && (
                <section
                  className="mt-8 border-2 border-black bg-[#f4f4f0] p-6"
                  aria-labelledby="owner-applications-heading"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-5">
                    <div>
                      <span className="text-xs uppercase text-neutral-500">
                        Owner controls
                      </span>
                      <h2
                        id="owner-applications-heading"
                        className="text-xl font-bold uppercase tracking-tight mt-1"
                      >
                        Applications Received
                      </h2>
                    </div>
                    {!applicationsLoading && !applicationsError && (
                      <span className="text-xs uppercase text-neutral-500">
                        {ownerApplications.length} received
                      </span>
                    )}
                  </div>

                  {applicationFeedback && (
                    <p
                      role="status"
                      className="mb-4 border border-black bg-white p-3 text-sm"
                    >
                      {applicationFeedback}
                    </p>
                  )}

                  {applicationsLoading && (
                    <p className="border border-black bg-white p-4 text-sm">
                      Loading applications...
                    </p>
                  )}

                  {!applicationsLoading && applicationsError && (
                    <p
                      role="alert"
                      className="border border-red-600 bg-white p-4 text-sm text-red-700"
                    >
                      {applicationsError}
                    </p>
                  )}

                  {!applicationsLoading &&
                    !applicationsError &&
                    ownerApplications.length === 0 && (
                      <p className="border border-black bg-white p-4 text-sm">
                        No applications received yet.
                      </p>
                    )}

                  {!applicationsLoading &&
                    !applicationsError &&
                    ownerApplications.length > 0 && (
                      <div className="space-y-4">
                        {ownerApplications.map((application) => {
                          const isUpdating =
                            updatingApplicationId ===
                            application.application_id;

                          return (
                            <article
                              key={application.application_id}
                              className="border border-neutral-300 bg-white p-4"
                            >
                              <div className="flex flex-col md:flex-row md:justify-between gap-3">
                                <div>
                                  <p className="font-bold">
                                    Applicant name unavailable
                                  </p>
                                  <p className="text-sm">
                                    {application.user_email}
                                  </p>
                                  <p className="text-xs text-neutral-500 mt-1">
                                    Submitted{" "}
                                    {application.created_at
                                      ? new Date(
                                          application.created_at
                                        ).toLocaleDateString()
                                      : "Date unavailable"}
                                  </p>
                                </div>
                                <span className="self-start px-2 py-1 text-[10px] uppercase bg-blue-100 text-blue-800">
                                  {application.status || "Applied"}
                                </span>
                              </div>

                              <dl className="mt-4 space-y-3 text-sm">
                                <div>
                                  <dt className="text-[10px] uppercase text-neutral-500">
                                    Application type
                                  </dt>
                                  <dd>{application.application_type}</dd>
                                </div>
                                <div>
                                  <dt className="text-[10px] uppercase text-neutral-500">
                                    Cover note
                                  </dt>
                                  <dd className="mt-1 whitespace-pre-wrap">
                                    {application.cover_note ||
                                      "No cover note provided."}
                                  </dd>
                                </div>
                              </dl>

                              {application.status === "Applied" && (
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
                                    className="px-4 py-2 bg-black text-white text-xs uppercase tracking-wider disabled:opacity-50"
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
                                    className="px-4 py-2 border border-black text-xs uppercase tracking-wider disabled:opacity-50"
                                  >
                                    {isUpdating ? "Updating..." : "Reject"}
                                  </button>
                                </div>
                              )}
                            </article>
                          );
                        })}
                      </div>
                    )}
                </section>
              )}
          </>
        )}
      </div>

      {isApplyModalOpen && project && (
        <ProjectApplicationModal
          projectId={project.id}
          onClose={() => setIsApplyModalOpen(false)}
          onSuccess={() => {
            setIsApplyModalOpen(false);
            alert("Application submitted successfully!");
            navigate(-1);
          }}
        />
      )}
    </div>
  );
}

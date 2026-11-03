import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../utils/api";

export default function InvestorDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState("");

  const loadOwnerData = useCallback(async () => {
    try {
      setDataLoading(true);
      setDataError("");

      let storedUser;
      try {
        storedUser = JSON.parse(
          localStorage.getItem("projex_user") || "null"
        );
      } catch {
        storedUser = null;
      }

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
      const projectsData = await projectsResponse.json();
      const applicationsData = await applicationsResponse.json();

      if (!projectsResponse.ok || !projectsData.success) {
        throw new Error(
          projectsData.error || "Could not load your projects."
        );
      }

      if (!applicationsResponse.ok || !applicationsData.success) {
        throw new Error(
          applicationsData.error || "Could not load your applications."
        );
      }

      setProjects(
        (projectsData.projects || []).filter(
          (project) => String(project.user_id) === String(ownerId)
        )
      );
      setApplications(applicationsData.applications || []);
    } catch (error) {
      setDataError(error.message || "Could not load dashboard data.");
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOwnerData();

    const refreshOnFocus = () => {
      loadOwnerData();
    };

    window.addEventListener("focus", refreshOnFocus);

    return () => {
      window.removeEventListener("focus", refreshOnFocus);
    };
  }, [loadOwnerData]);

  const projectIds = useMemo(
    () => new Set(projects.map((project) => String(project.id))),
    [projects]
  );

  const ownerApplications = useMemo(
    () =>
      applications.filter((application) =>
        projectIds.has(String(application.project_id))
      ),
    [applications, projectIds]
  );

  const applicationCounts = useMemo(() => {
    const counts = new Map();

    ownerApplications.forEach((application) => {
      const projectId = String(application.project_id);
      counts.set(projectId, (counts.get(projectId) || 0) + 1);
    });

    return counts;
  }, [ownerApplications]);

  const dashboardStats = useMemo(
    () => ({
      projects: projects.length,
      applications: ownerApplications.length,
      pending: ownerApplications.filter(
        (application) => application.status === "Applied"
      ).length,
      accepted: ownerApplications.filter(
        (application) => application.status === "Accepted"
      ).length,
    }),
    [projects, ownerApplications]
  );

  const formatDate = (value) => {
    if (!value) return "No deadline";

    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? String(value)
      : date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#F3F3EF] text-[#0A0A0A] font-sans px-6 md:px-12 py-12 relative selection:bg-black selection:text-white">
      <div>
        
        {/* Dashboard Top Banner */}
        <div className="flex justify-between items-end mb-10 pb-4 border-b border-black">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">Registry / Control Center</span>
            <h1 className="text-3xl font-bold tracking-tight uppercase mt-1">Investor Dashboard</h1>
          </div>
          <span className="text-xs font-mono uppercase tracking-widest px-3 py-1 bg-black text-white">
            Status: Active Partner
          </span>
        </div>

        {/* Discover Talent Section */}
        <div className="mb-14">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">Pool</span>
              <h2 className="text-2xl font-bold tracking-tight uppercase mt-1">Discover Talent</h2>
            </div>
            <Link to="/student" className="text-xs font-mono uppercase tracking-wider underline underline-offset-4 hover:text-neutral-600">
              View All →
            </Link>
          </div>

          <div className="border border-black bg-white p-6">
            <p className="text-sm leading-relaxed max-w-2xl">
              The public talent directory is not available yet. Review
              applicants from My Projects or start a conversation through the
              authenticated Messages page.
            </p>
          </div>
        </div>

        <section className="mb-10" aria-labelledby="dashboard-stats-heading">
          <h2 id="dashboard-stats-heading" className="sr-only">
            Dashboard statistics
          </h2>
          {dataLoading && (
            <div className="border border-black bg-white p-5 text-sm font-mono uppercase">
              Loading dashboard data...
            </div>
          )}

          {!dataLoading && dataError && (
            <div className="border border-red-600 bg-white p-5">
              <p role="alert" className="text-sm text-red-700 mb-4">
                {dataError}
              </p>
              <button
                type="button"
                onClick={loadOwnerData}
                className="px-4 py-2 bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800"
              >
                Retry
              </button>
            </div>
          )}

          {!dataLoading && !dataError && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                ["Projects Posted", dashboardStats.projects],
                ["Applications", dashboardStats.applications],
                ["Pending", dashboardStats.pending],
                ["Accepted", dashboardStats.accepted],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="border border-black bg-white p-4"
                >
                  <span className="block text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                    {label}
                  </span>
                  <span className="block text-2xl font-bold mt-2">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Main Grid Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          
          {/* Post a Project Card -> Opens the Modal */}
          <div className="border border-black bg-white p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 border border-neutral-300 px-2 py-0.5 inline-block mb-3">
                Action 01
              </span>
              <h3 className="font-bold text-lg uppercase tracking-tight mb-2">Post a Project</h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-6">
                Short quick post to receive rapid student execution submissions.
              </p>
            </div>
            <button
              onClick={() => navigate("/project-owner/post")}
              className="w-full py-2.5 bg-black text-white text-center text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors block cursor-pointer"
            >
              Post a Project →
            </button>
          </div>

          {/* My Posted Projects */}
          <div className="border border-black bg-white p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 border border-neutral-300 px-2 py-0.5 inline-block">
                  Action 02
                </span>
                <Link to="/project-owner/projects" className="text-xs font-mono uppercase tracking-wider underline">
                  View All →
                </Link>
              </div>
              <h3 className="font-bold text-lg uppercase tracking-tight mb-2">My Posted Projects</h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-6">
                Track active deployments, review candidate artifacts, and settle completed deals.
              </p>
            </div>
            {!dataLoading && !dataError && projects.length === 0 && (
              <div className="border border-neutral-300 bg-[#F3F3EF] p-4 text-xs font-mono">
                <p className="mb-3">No projects posted yet.</p>
                <button
                  type="button"
                  onClick={() => navigate("/project-owner/post")}
                  className="underline uppercase tracking-wider"
                >
                  Post your first project →
                </button>
              </div>
            )}

            {!dataLoading && !dataError && projects.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projects.slice(0, 4).map((project) => (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="border border-neutral-300 bg-[#F3F3EF] p-3 text-xs font-mono hover:bg-neutral-200"
                  >
                    <span className="block font-bold text-black truncate">
                      {project.title}
                    </span>
                    <span className="block text-[10px] text-neutral-500 mt-1">
                      {applicationCounts.get(String(project.id)) || 0}{" "}
                      applications
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {!dataLoading && !dataError && projects.length > 0 && (
        <section
          className="mt-10 border border-black bg-white p-6"
          aria-labelledby="posted-projects-heading"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-5">
            <div>
              <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">
                Owner registry
              </span>
              <h2
                id="posted-projects-heading"
                className="text-xl font-bold uppercase tracking-tight mt-1"
              >
                Posted Projects
              </h2>
            </div>
            <span className="text-xs font-mono uppercase text-neutral-500">
              {projects.length} total
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border border-neutral-300 p-4 bg-[#F3F3EF]"
              >
                <div className="flex justify-between gap-4">
                  <h3 className="font-bold uppercase tracking-tight truncate">
                    {project.title}
                  </h3>
                  <span className="text-xs font-mono whitespace-nowrap">
                    {applicationCounts.get(String(project.id)) || 0} apps
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-mono">
                  <div>
                    <span className="block text-[10px] uppercase text-neutral-500">
                      Budget
                    </span>
                    <span>₹{project.price ?? "—"}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-neutral-500">
                      Deadline
                    </span>
                    <span>{formatDate(project.deadline)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="fixed bottom-6 right-6 z-40">
        <Link
          to="/project-owner/chat"
          className="block bg-black text-white border border-black px-4 py-3 shadow-xl hover:bg-neutral-800 transition-all text-xs font-mono uppercase tracking-wider"
        >
          Open Messages →
        </Link>
      </div>

    </div>
  );
}
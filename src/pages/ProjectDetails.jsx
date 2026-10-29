import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectApplicationModal from "../components/ProjectApplicationModal";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  let loggedInUser = { email: "student@jain.in" };
  try {
    loggedInUser =
      JSON.parse(localStorage.getItem("projex_user")) ||
      loggedInUser;
  } catch {
    // Use the fallback account when stored session data is invalid.
  }

  useEffect(() => {
    let cancelled = false;

    async function loadProject() {
      setIsLoading(true);
      setError("");
      setProject(null);
      setIsApplyModalOpen(false);

      try {
        const response = await fetch(
          `${API_URL}/api/projects/${encodeURIComponent(id)}`
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

                <button
                  onClick={() => setIsApplyModalOpen(true)}
                  className="w-full bg-black text-white py-3 text-xs uppercase tracking-widest font-bold border-2 border-black hover:bg-neutral-800 transition cursor-pointer text-center mt-6"
                >
                  Apply For Project →
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {isApplyModalOpen && project && (
        <ProjectApplicationModal
          projectId={project.id}
          userEmail={loggedInUser.email}
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

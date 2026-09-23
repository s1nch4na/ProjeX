import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projects } from "../utils/mockData";
import ProjectApplicationModal from "../components/ProjectApplicationModal";


export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Get logged-in user from localStorage safely
  const loggedInUser = JSON.parse(localStorage.getItem("projex_user")) || { email: "student@jain.in" };

  const project = projects.find((p) => String(p.id) === id);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-mono">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => navigate(-1)}
      />

      {/* Modal Box */}
      <div className="relative bg-white border-2 border-black rounded-none w-[90%] max-w-5xl max-h-[90vh] overflow-y-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">

        {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-black hover:bg-black hover:text-white border border-black px-2 py-1 text-sm transition cursor-pointer"
        >
          ✕
        </button>

        {/* Image */}
        <div className="w-full h-56 bg-[#F3F3EF] border-2 border-black mb-8 overflow-hidden">
          <img
            src={project.image || "https://placehold.co/800x400"}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="md:col-span-2 space-y-4">
            <span className="text-xs uppercase bg-black text-white px-2 py-0.5">{project.category}</span>
            <h1 className="text-2xl font-bold uppercase tracking-tight">{project.title}</h1>

            <p className="text-sm font-bold text-neutral-800">
              {project.shortDescription}
            </p>

            <p className="text-xs text-neutral-600 leading-relaxed">
              {project.fullDescription}
            </p>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 pt-4">
              {project.skillsRequired.map((skill, index) => (
                <span
                  key={index}
                  className="bg-[#f4f4f0] border border-black px-3 py-1 text-xs uppercase"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Right Section / Sidebar */}
          <div className="border-2 border-black p-6 bg-[#f4f4f0] space-y-6 flex flex-col justify-between">
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-neutral-500 uppercase block font-bold">Budget</span>
                <span className="text-xl font-bold text-black">₹{project.budget}</span>
              </div>

              <div>
                <span className="text-neutral-500 uppercase block font-bold">Deadline</span>
                <span className="text-black">{project.deadline}</span>
              </div>

              <div>
                <span className="text-neutral-500 uppercase block font-bold">Posted On</span>
                <span className="text-black">{project.datePosted}</span>
              </div>

              <div>
                <span className="text-neutral-500 uppercase block font-bold">Experience Level</span>
                <span className="text-black">{project.experienceLevel}</span>
              </div>

              <div className="pt-2 border-t border-neutral-300">
                <span className="text-neutral-500 uppercase block font-bold">Posted By</span>
                <span className="font-bold text-black block">{project.postedBy.name}</span>
                <span className="text-neutral-600 text-[10px] block">{project.postedBy.role}</span>
                <span className="text-yellow-600 font-bold text-xs mt-1 block">
                  ⭐ {project.postedBy.rating}
                </span>
              </div>
            </div>

            {/* --- APPLY BUTTON IN THE SIDEBAR --- */}
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="w-full bg-black text-white py-3 text-xs uppercase tracking-widest font-bold border-2 border-black hover:bg-neutral-800 transition cursor-pointer text-center mt-6"
            >
              Apply For Project →
            </button>
          </div>
        </div>
      </div>

      {/* Popup Submission Modal when Apply is clicked */}
      {isApplyModalOpen && (
        <ProjectApplicationModal 
          projectId={project.id}
          userEmail={loggedInUser.email}
          onClose={() => setIsApplyModalOpen(false)}
          onSuccess={() => {
            setIsApplyModalOpen(false);
            alert("Application submitted successfully!");
            navigate(-1); // Optionally close details modal after successful submission
          }}
        />
      )}
    </div>
  );
}
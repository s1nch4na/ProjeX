import { useParams, useNavigate } from "react-router-dom";
import { projects } from "../utils/mockData";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const project = projects.find((p) => String(p.id) === id);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => navigate(-1)}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-[90%] max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl p-8">

        {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        {/* Image */}
        <img
          src={project.image}
          alt={project.title}
          className="w-full rounded-xl mb-8"
        />

        <div className="grid grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="col-span-2 space-y-4">
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <p className="text-gray-500">{project.category}</p>

            <p className="text-lg font-medium">
              {project.shortDescription}
            </p>

            <p className="text-gray-700">
              {project.fullDescription}
            </p>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 pt-4">
              {project.skillsRequired.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="border-l pl-6 space-y-6">
            <div>
              <p className="font-semibold">Budget</p>
              <p className="text-xl font-bold">₹{project.budget}</p>
            </div>

            <div>
              <p className="font-semibold">Deadline</p>
              <p className="text-gray-500">{project.deadline}</p>
            </div>

            <div>
              <p className="font-semibold">Posted On</p>
              <p className="text-gray-500">{project.datePosted}</p>
            </div>

            <div>
              <p className="font-semibold">Experience Level</p>
              <p className="text-gray-500">{project.experienceLevel}</p>
            </div>

            <div>
              <p className="font-semibold">Posted By</p>
              <p className="font-medium">{project.postedBy.name}</p>
              <p className="text-gray-500 text-sm">
                {project.postedBy.role}
              </p>
              <p className="text-yellow-600 text-sm">
                ⭐ {project.postedBy.rating}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
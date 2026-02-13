import { useParams, useNavigate } from "react-router-dom";
import { projects } from "../utils/mockData";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const project = projects.find((p) => String(p.id) === id);

  if (!project) {
    return null;
  }

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

        <img
          src={project.image}
          alt={project.title}
          className="w-full rounded-xl mb-8"
        />

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-4">
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <p className="text-gray-500">{project.meta}</p>
            <p className="text-gray-700">{project.description}</p>
          </div>

          <div className="border-l pl-6 space-y-4">
            <div>
              <p className="font-semibold">Budget</p>
              <p className="text-xl font-bold">₹{project.price}</p>
            </div>

            <div>
              <p className="font-semibold">Posted On</p>
              <p className="text-gray-500">{project.datePosted}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

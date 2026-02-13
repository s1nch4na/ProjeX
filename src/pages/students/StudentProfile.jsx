// src/pages/students/StudentProfile.jsx
import { useNavigate } from "react-router-dom";

export default function StudentProfile() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => navigate(-1)}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-[90%] max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl p-10">

        {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 right-6 text-gray-500 hover:text-black text-2xl"
        >
          ✕
        </button>

        {/* Profile Header */}
        <div className="flex gap-8 items-center">
          <div className="w-32 h-32 bg-gray-300 rounded-full" />
          <div>
            <h1 className="text-3xl font-bold">Student Name</h1>
            <p className="text-gray-600">
              Freelance Designer · UI / Branding
            </p>
            <div className="mt-3 flex gap-3">
              <span className="px-3 py-1 bg-[#7c3aed]/10 text-[#7c3aed] rounded-full">
                Available
              </span>
              <button className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg">
                Hire
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-2 bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-gray-600">
              Short bio about the student: their skills, focus areas and what
              they enjoy building.
            </p>

            <div className="mt-6">
              <h4 className="font-medium mb-3">Portfolio</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-40 bg-gray-200 rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>

          <aside className="bg-gray-50 rounded-xl p-6">
            <h4 className="font-semibold mb-3">Stats</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Projects Completed: 12</p>
              <p>Rating: 4.8/5</p>
              <p>Location: Bangalore</p>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {["Photoshop", "Illustrator", "Figma"].map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2 py-1 border rounded text-gray-600"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </section>

        {/* Testimonials */}
        <section className="mt-10">
          <h4 className="font-semibold mb-4">Testimonials</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <p className="text-gray-700">
                  "Great work — quick and clean!"
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  — Local Café
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

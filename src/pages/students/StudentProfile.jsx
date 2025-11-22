import React from "react";

export default function StudentProfile() {
  return (
    <div className="px-12 py-10 max-w-6xl mx-auto">
      <div className="flex gap-8 items-center">
        <div className="w-32 h-32 bg-gray-300 rounded-full" />
        <div>
          <h1 className="text-3xl font-bold">Student Name</h1>
          <p className="text-gray-600">Freelance Designer · UI / Branding</p>
          <div className="mt-3 flex gap-3">
            <span className="px-3 py-1 bg-[#7c3aed]/10 text-[#7c3aed] rounded-full">Available</span>
            <button className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg">Hire</button>
          </div>
        </div>
      </div>

      <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold mb-2">About</h3>
          <p className="text-gray-600">Short bio about the student: their skills, focus areas and what they enjoy building.</p>

          <div className="mt-6">
            <h4 className="font-medium mb-2">Portfolio</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_,i)=>(<div key={i} className="h-40 bg-gray-100 rounded-lg" />))}
            </div>
          </div>
        </div>

        <aside className="bg-white rounded-xl p-6 shadow-sm">
          <h4 className="font-semibold mb-3">Stats</h4>
          <div className="text-sm text-gray-600">
            <p>Projects Completed: 12</p>
            <p>Rating: 4.8/5</p>
            <p>Location: Bangalore</p>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {["Photoshop","Illustrator","Figma"].map(s => (
                <span key={s} className="text-xs px-2 py-1 border rounded text-gray-600">{s}</span>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-8">
        <h4 className="font-semibold mb-3">Testimonials</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_,i)=>(
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-gray-700">"Great work — quick and clean!"</p>
              <p className="text-xs text-gray-500 mt-2">— Local Café</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

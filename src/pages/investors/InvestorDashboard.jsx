import React from "react";
import ProfileCard from "../../components/ProfileCard";
import HorizontalScroller from "../../components/HorizontalScroller";
import mockTalents from "../../data/mockTalents";

export default function InvestorDashboard() {
  return (
    <div className="px-12 py-10">
      <h2 className="text-2xl font-semibold mb-4">Discover Talent</h2>

      <div className="mb-6">
        <HorizontalScroller>
          {mockTalents.map((talent) => (
            <ProfileCard
              key={talent.id}
              id={talent.id}
              name={talent.name}
              role={talent.role}
              skills={talent.skills}
              image={talent.image}
            />
          ))}
        </HorizontalScroller>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-2">Post a Project</h3>
          <p className="text-sm text-gray-600 mb-4">
            Short quick post to receive submissions.
          </p>
          <a
            href="/investor/post"
            className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg"
          >
            Post a Project
          </a>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-2">My Posted Projects</h3>
          <p className="text-sm text-gray-600">
            Track your active and completed projects.
          </p>
          <a
            href="/investor/projects"
            className="text-sm text-purple-600"
          >
            Manage projects →
          </a>
        </div>
      </div>
    </div>
  );
}

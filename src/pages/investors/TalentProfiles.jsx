import React from "react";
import ProfileCard from "../../components/ProfileCard";
import mockTalents from "../../data/mockTalents";

export default function TalentProfiles() {
  return (
    <div className="px-12 py-10">
      <h2 className="text-2xl font-semibold mb-6">All Talent</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
}

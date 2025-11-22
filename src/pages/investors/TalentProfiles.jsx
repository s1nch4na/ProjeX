import React from "react";
import ProfileCard from "../../components/ProfileCard";

export default function TalentProfiles(){
  return (
    <div className="px-12 py-10">
      <h2 className="text-2xl font-semibold mb-6">All Talent</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[...Array(9)].map((_,i)=>(<ProfileCard key={i} name={`Student ${i+1}`} role="Freelancer" skills={['Figma','Brand']}/>))}
      </div>
    </div>
  );
}

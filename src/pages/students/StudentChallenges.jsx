import React from "react";
import ProjectCard from "../../components/ProjectCard";

export default function StudentChallenges() {
  return (
    <div className="px-12 py-8">
      <h2 className="text-2xl font-semibold mb-6">Challenge Hub</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_,i)=>(<ProjectCard key={i} title={`Challenge ${i+1}`} meta="Logo / Poster" price={1000+i*200}/>))}
      </div>
    </div>
  );
}

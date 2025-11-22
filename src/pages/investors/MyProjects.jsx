import React from "react";
import ProjectCard from "../../components/ProjectCard";

export default function MyProjects(){
  return (
    <div className="px-12 py-10">
      <h2 className="text-2xl font-semibold mb-4">My Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_,i)=>(<ProjectCard key={i} title={`My Project ${i+1}`} meta="Active" price={3000+i*500}/>))}
      </div>
    </div>
  );
}

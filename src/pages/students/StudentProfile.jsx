import { useNavigate, useParams } from "react-router-dom";
import mockTalents from "../../data/mockTalents";

export default function StudentProfile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const creator = mockTalents.find(
    (user) => user.id === Number(id)
  );

  if (!creator) {
    return <div>User not found</div>;
  }

  return (
    <div className="p-10">
      <button onClick={() => navigate(-1)}>Back</button>

      <h1 className="text-3xl font-bold mt-4">{creator.name}</h1>
      <p className="text-gray-600">{creator.role}</p>
      <p className="mt-4">{creator.bio}</p>

      <div className="mt-4">
        {creator.skills.map((skill) => (
          <span key={skill} className="mr-2 text-sm border px-2 py-1 rounded">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

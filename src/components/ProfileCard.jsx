export default function ProfileCard({ name, role, skills }) {
  return (
    <div className="min-w-[200px] bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="w-16 h-16 bg-gray-200 rounded-full mb-3" />
      <h4 className="font-semibold text-[#101624]">{name}</h4>
      <p className="text-xs text-gray-500">{role}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {(skills || ["UI", "Brand"]).map((s) => (
          <span key={s} className="text-xs border px-2 py-1 rounded-md text-gray-600">{s}</span>
        ))}
      </div>
    </div>
  );
}

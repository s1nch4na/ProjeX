import { useState } from "react";
import { saveProfile } from "../../utils/saveProfile";
import { auth } from "../../utils/firebaseAuth";

export default function StudentProfileSetup() {
  const [form, setForm] = useState({
    name: "",
    bio: "",
    role: "",
    skills: [],
    socials: {},
    profilePicFile: null,
    resumeFile: null,
    portfolioFiles: [],
  });

  const handleSubmit = async () => {
    const uid = auth.currentUser.uid;
    await saveProfile(uid, form);
    alert("Profile Saved!");
  };

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Complete your Profile</h1>

      <input
        type="text"
        placeholder="Name"
        className="input"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <textarea
        placeholder="Bio"
        className="input"
        onChange={(e) => setForm({ ...form, bio: e.target.value })}
      />

      <input
        type="file"
        onChange={(e) => setForm({ ...form, profilePicFile: e.target.files[0] })}
      />

      <input
        type="file"
        onChange={(e) => setForm({ ...form, resumeFile: e.target.files[0] })}
      />

      <input
        type="file"
        multiple
        onChange={(e) =>
          setForm({ ...form, portfolioFiles: Array.from(e.target.files) })
        }
      />

      <button
        className="bg-purple-600 text-white px-4 py-2 rounded-lg mt-4"
        onClick={handleSubmit}
      >
        Save Profile
      </button>
    </div>
  );
}

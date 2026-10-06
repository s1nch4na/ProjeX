import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Landing from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import ProjectDetails from "./pages/ProjectDetails";
import ProfileOnboarding from "./pages/ProfileOnboarding";

import StudentDashboard from "./pages/students/StudentDashboard";
import StudentProfile from "./pages/students/StudentProfile";
import EditProfile from "./pages/students/EditProfile";
import StudentChallenges from "./pages/students/StudentChallenges";
import ResumeUpload from "./pages/students/ResumeUpload";
import StudentChat from "./pages/students/StudentChat";

import InvestorDashboard from "./pages/investors/InvestorDashboard";
import TalentProfiles from "./pages/investors/TalentProfiles";
import PostProject from "./pages/investors/PostProject";
import MyProjects from "./pages/investors/MyProjects";
import InvestorChat from "./pages/investors/InvestorChat";

function AppRoutes() {
  const location = useLocation();
  const state = location.state;

  return (
    <>
      <Routes location={state?.background || location}>

        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/profile-onboarding"
          element={<ProfileOnboarding />}
        />

        {/* STUDENT */}
        <Route
          path="/student"
          element={<StudentDashboard />}
        />

        <Route
          path="/student/profile"
          element={<StudentProfile />}
        />

        <Route
          path="/student/profile/edit"
          element={<EditProfile />}
        />

        <Route
          path="/student/challenges"
          element={<StudentChallenges />}
        />

        <Route
          path="/student/resume"
          element={<ResumeUpload />}
        />

        <Route
          path="/student/chat"
          element={<StudentChat />}
        />

        {/* PROJECT OWNER */}
        <Route
          path="/project-owner"
          element={<InvestorDashboard />}
        />

        <Route
          path="/project-owner/talent"
          element={<TalentProfiles />}
        />

        <Route
          path="/project-owner/post"
          element={<PostProject />}
        />

        <Route
          path="/project-owner/projects"
          element={<MyProjects />}
        />

        <Route
          path="/project-owner/chat"
          element={<InvestorChat />}
        />

        {/* PROJECTS */}
        <Route
          path="/projects/:id"
          element={<ProjectDetails />}
        />

        {/* CREATOR PROFILE */}
        <Route
          path="/creators/:id"
          element={<StudentProfile />}
        />

      </Routes>

      {/* BACKGROUND MODAL ROUTES */}
      {state?.background && (
        <Routes>

          <Route
            path="/projects/:id"
            element={<ProjectDetails />}
          />

          <Route
            path="/creators/:id"
            element={<StudentProfile />}
          />

        </Routes>
      )}

    </>
  );
}

export default function App() {
  return (
    <Router>

      <div className="min-h-screen flex flex-col">

        <Navbar />

        <main className="flex-grow">
          <AppRoutes />
        </main>

        <Footer />

      </div>

    </Router>
  );
}
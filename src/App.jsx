import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate
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

function RoleRoute({ role, children }) {
  const location = useLocation();
  let user = null;
  const token = localStorage.getItem("projex_token");

  try {
    user = JSON.parse(localStorage.getItem("projex_user") || "null");
  } catch (error) {
    console.error("Could not read ProJeX session:", error);
  }

  if (!token || user?.role !== role) {
    if (role === "investor") {
      return (
        <Navigate
          to="/login"
          replace
          state={{
            authRole: "investor",
            returnTo: location.pathname,
          }}
        />
      );
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}

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
          element={
            <RoleRoute role="investor">
              <InvestorDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/project-owner/talent"
          element={
            <RoleRoute role="investor">
              <TalentProfiles />
            </RoleRoute>
          }
        />

        <Route
          path="/project-owner/post"
          element={
            <RoleRoute role="investor">
              <PostProject />
            </RoleRoute>
          }
        />

        <Route
          path="/project-owner/projects"
          element={
            <RoleRoute role="investor">
              <MyProjects />
            </RoleRoute>
          }
        />

        <Route
          path="/project-owner/chat"
          element={
            <RoleRoute role="investor">
              <InvestorChat />
            </RoleRoute>
          }
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
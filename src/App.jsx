import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* Pages */
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import ProjectDetails from "./pages/ProjectDetails";

/* Students */
import StudentDashboard from "./pages/students/StudentDashboard";
import StudentProfile from "./pages/students/StudentProfile";
import StudentChallenges from "./pages/students/StudentChallenges";
import ResumeUpload from "./pages/students/ResumeUpload";
import StudentChat from "./pages/students/StudentChat";

/* Investors */
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
      {/* Base Routes */}
      <Routes location={state?.background || location}>
        {/* Global */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Student */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/challenges" element={<StudentChallenges />} />
        <Route path="/student/resume" element={<ResumeUpload />} />
        <Route path="/student/chat" element={<StudentChat />} />

        {/* Investor */}
        <Route path="/investor" element={<InvestorDashboard />} />
        <Route path="/investor/talent" element={<TalentProfiles />} />
        <Route path="/investor/post" element={<PostProject />} />
        <Route path="/investor/projects" element={<MyProjects />} />
        <Route path="/investor/chat" element={<InvestorChat />} />

        {/* Direct Access Pages */}
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/creators/:id" element={<StudentProfile />} />
      </Routes>

      {/* Modal Routes (Only when background exists) */}
      {state?.background && (
        <Routes>
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/creators/:id" element={<StudentProfile />} />
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

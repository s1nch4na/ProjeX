import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* Pages */
import Landing from "./pages/Landing";
import Login from "./pages/Login";

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
import ProjectDetail from "./pages/investors/ProjectDetail";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            {/* Global */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            {/* Student flow */}
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/challenges" element={<StudentChallenges />} />
            <Route path="/student/resume" element={<ResumeUpload />} />
            <Route path="/student/chat" element={<StudentChat />} />

            {/* Investor flow */}
            <Route path="/investor" element={<InvestorDashboard />} />
            <Route path="/investor/talent" element={<TalentProfiles />} />
            <Route path="/investor/post" element={<PostProject />} />
            <Route path="/investor/projects" element={<MyProjects />} />
            <Route path="/investor/chat" element={<InvestorChat />} />
            <Route path="/creators" element={<StudentProfile />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

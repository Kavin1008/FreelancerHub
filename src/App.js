import React, { useEffect, useState } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import SignUp from "./pages/register";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "./components/firebase";
import FreelancerJobs from "./pages/Freelancer";
import HierFreelancer from "./components/client/HireFreelancer";
import AlertDialogSlide from "./components/client/PostProjects";
import Client from "./pages/Client";
import LandingPage from "./pages/LandingPage";
import Admin from "./pages/Admin";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="App">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/admin-dashboard" element={<Admin />} />
              <Route path="/client-dashboard" element={<Client />} />
              <Route
                path="/freelancer-dashboard"
                element={<FreelancerJobs />}
              />
              <Route path="/hirefreelancer" element={<HierFreelancer />} />
              <Route path="/postprojects" element={<AlertDialogSlide />} />
            </Routes>
            <ToastContainer />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;

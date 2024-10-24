import React, { useEffect, useState } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./components/login";
import SignUp from "./components/register";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "./components/firebase";
import FreelancerJobs from "./components/Freelancer";
import HierFreelancer from "./components/HireFreelancer";
import AlertDialogSlide from "./components/PostProjects";
import Client from "./components/Client";
import LandingPage from "./components/LandingPage";

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
              <Route
                path="/"
                element={<LandingPage />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/client-dashboard" element={<Client />} />
              <Route path="/freelancer-dashboard" element={<FreelancerJobs />} />
              <Route path="/hirefreelancer" element={<HierFreelancer/>}/>
              <Route path="/postprojects" element={<AlertDialogSlide/>}/>
            </Routes>
            <ToastContainer />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;

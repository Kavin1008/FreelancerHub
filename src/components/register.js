import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { v4 as id } from "uuid";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [utype, setUtype] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!utype) {
      toast.error("Please select a user type.", {
        position: "bottom-center",
      });
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Choose the collection based on user type
      const collection = utype === "Client" ? "Client" : utype === "Freelancer" ? "Freelancer" : "Admin";

      await setDoc(doc(db, collection, user.uid), {
        id: id(),
        email: user.email,
        firstName: fname,
        lastName: lname,
        usertype: utype,
        photo: "",
      });

      console.log("User Registered Successfully!!");
      toast.success("User Registered Successfully!!", {
        position: "top-center",
      });

      // Redirect based on user type
      navigate(
        utype === "Freelancer" ? "/freelancer-dashboard" : utype === "client" ? "/client-dashboard" : "/admin-dashboard"
      );
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <form
        onSubmit={handleRegister}
        className="border rounded p-4 shadow"
        style={{ width: "300px" }}
      >
        <h3>Sign Up</h3>

        <div className="mb-3">
          <label>First name</label>
          <input
            type="text"
            className="form-control"
            placeholder="First name"
            onChange={(e) => setFname(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Last name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Last name"
            onChange={(e) => setLname(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>User Type</label>
          <select
            className="form-control"
            value={utype}
            onChange={(e) => setUtype(e.target.value)}
            required
          >
            <option value="">Select User Type</option>
            <option value="Admin">Admin</option>
            <option value="Freelancer">Freelancer</option>
            <option value="Client">Client</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>

        <p className="forgot-password text-right">
          Already registered <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
  
  
}

export default Register;

import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { auth } from "../services/firebase";
import logo from "../assets/smaa-logo.png";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut(auth);
    navigate("/login");
  }

  return (
    <div className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="nav-brand">
          <img src={logo} alt="SMAA Logo" />
          <span>SMAA</span>
        </Link>

        <div className="nav-links">
          {user ? (
            <>
              <Link to="/adult">Adult</Link>
              <Link to="/caregiver">Caregiver</Link>
              <Link to="/clinician">Clinician</Link>
              <button className="secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
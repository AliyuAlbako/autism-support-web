import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/smaa-logo.png";

export default function Navbar() {
  const { user } = useAuth();

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
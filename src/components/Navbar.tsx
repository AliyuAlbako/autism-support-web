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
          {!user ? (
            <>
              <Link to="/">Home</Link>
              <Link to= "/about">About</Link>
              <Link to= "/contact">Contact</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
              
            </>
          ) : (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/discover">Discover</Link>
              <Link to="/requests">Requests</Link>
              <Link to="/support-team">Support Team</Link>
              <button className="secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
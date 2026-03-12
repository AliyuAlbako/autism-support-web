import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/smaa-logo.png";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="hero">
      <div className="hero-inner">
        <img src={logo} alt="SMAA Logo" className="hero-logo" />

        <h1>Smart Monitoring for Autism Assistance</h1>

        <p>
          Helping autistic adults build daily routines, strengthen independence,
          and connect with caregivers and professionals through structured support.
        </p>

        <div className="hero-actions">
          {user ? (
            <Link to="/dashboard">
              <button>Go to Dashboard</button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <button>Get Started</button>
              </Link>

              <Link to="/login">
                <button className="secondary">Login</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
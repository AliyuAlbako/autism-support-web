import { Link } from "react-router-dom";
import logo from "../assets/smaa-logo.png";

export default function Home() {
  return (
    <div className="hero">
      <div className="hero-inner">
        <img src={logo} alt="SMAA Logo" className="hero-logo" />

        <h1>Smart Monitoring for Autism Assistance</h1>

        <p>
          Helping autistic adults build daily routines, strengthen independence,
          and keep caregivers informed in real time.
        </p>

        <div className="hero-actions">
          <Link to="/register">
            <button>Get Started</button>
          </Link>

          <Link to="/login">
            <button className="secondary">Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
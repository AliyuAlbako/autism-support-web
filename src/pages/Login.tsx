import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";
import { getFirebaseAuthMessage } from "../utils/firebaseErrors";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorText("");

    if (!email.trim()) {
      setErrorText("Please enter your email address.");
      return;
    }

    if (!password.trim()) {
      setErrorText("Please enter your password.");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate("/dashboard");
    } catch (error: any) {
      setErrorText(getFirebaseAuthMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 480, margin: "40px auto" }}>
        <h2 className="section-title">Login</h2>
        <p className="subtle">Sign in to continue to your dashboard.</p>

        <form onSubmit={handleLogin} className="stack">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorText && (
            <p style={{ color: "#b91c1c", marginTop: -4 }}>{errorText}</p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="subtle" style={{ marginTop: 16 }}>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>

        <p className="subtle" style={{ marginTop: 8 }}>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
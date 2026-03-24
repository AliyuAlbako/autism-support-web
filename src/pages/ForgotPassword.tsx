import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebase";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import { getFirebaseAuthMessage } from "../utils/firebaseErrors";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setErrorText("");

    if (!email.trim()) {
      setErrorText("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email.trim());
      setMessage(
        "If an account exists for this email, a password reset link has been sent."
      );
      setEmail("");
    } catch (error: any) {
      setErrorText(getFirebaseAuthMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <OnboardingLayout
      title="Forgot Password"
      subtitle="Enter your email address and we’ll send you a reset link."
    >
      <form onSubmit={handleSubmit} className="stack" style={{ maxWidth: 480 }}>
        <div className="form-section">
          <label className="field-label">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          {errorText && (
            <p style={{ color: "#b91c1c", marginTop: 8 }}>{errorText}</p>
          )}

          {message && (
            <p style={{ color: "#166534", marginTop: 8 }}>{message}</p>
          )}

          <div style={{ marginTop: 16 }}>
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        </div>
      </form>
    </OnboardingLayout>
  );
}
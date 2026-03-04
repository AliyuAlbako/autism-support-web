import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

export default function RoleSetup() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const selectRole = async (role: "adult" | "caregiver" | "clinician") => {
    if (!user) return;

    setLoading(true);

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role,
      createdAt: new Date()
    });

    if (role === "adult") navigate("/adult");
    if (role === "caregiver") navigate("/caregiver");
    if (role === "clinician") navigate("/clinician");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Select Your Role</h2>

      <button onClick={() => selectRole("adult")} disabled={loading}>
        I am an Adult
      </button>

      <button onClick={() => selectRole("caregiver")} disabled={loading}>
        I am a Caregiver
      </button>

      <button onClick={() => selectRole("clinician")} disabled={loading}>
        I am a Clinician
      </button>
    </div>
  );
}
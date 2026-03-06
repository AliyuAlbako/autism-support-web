import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RoleSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function selectRole(role: "adult" | "caregiver" | "clinician") {
    if (!user) return;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      role,
      createdAt: serverTimestamp()
    });

    navigate(`/${role}`);
  }

  return (
    <div className="page">
      <div
        className="card"
        style={{ maxWidth: 640, margin: "40px auto" }}
      >
        <h2 className="section-title">Select Your Role</h2>
        <p className="subtle">
          Choose how you will use SMAA. This can be changed later if needed.
        </p>

        <div className="grid grid-2" style={{ marginTop: 20 }}>
          <div className="card">
            <h3>Adult</h3>
            <p className="subtle">
              Track routines, build consistency, and share progress with support people.
            </p>
            <button onClick={() => selectRole("adult")}>
              Continue as Adult
            </button>
          </div>

          <div className="card">
            <h3>Caregiver</h3>
            <p className="subtle">
              Connect to an adult account, monitor routines, and view activity updates.
            </p>
            <button onClick={() => selectRole("caregiver")}>
              Continue as Caregiver
            </button>
          </div>

          <div className="card">
            <h3>Clinician</h3>
            <p className="subtle">
              View progress data and support goal tracking in a professional role.
            </p>
            <button onClick={() => selectRole("clinician")}>
              Continue as Clinician
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
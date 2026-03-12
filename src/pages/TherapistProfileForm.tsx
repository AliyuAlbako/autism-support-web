import { useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

export default function TherapistProfileForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    certification: "",
    organization: "",
    supervisor: "",
    state: "",
  });

  const [serviceAreas, setServiceAreas] = useState<string[]>([]);

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleArrayValue(value: string) {
    if (serviceAreas.includes(value)) {
      setServiceAreas(serviceAreas.filter((item) => item !== value));
    } else {
      setServiceAreas([...serviceAreas, value]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      role: "therapist",
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, "therapist_profiles", user.uid), {
      ...form,
      serviceAreas,
      createdAt: serverTimestamp(),
    });

    navigate("/therapist");
  }

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 760, margin: "40px auto" }}>
        <h2 className="section-title">Therapist Profile</h2>
        <p className="subtle">Step 2 of 3 — Therapist / Behavior Technician</p>

        <form onSubmit={handleSubmit} className="stack" style={{ marginTop: 20 }}>
          <h3>Professional Information</h3>
          <input placeholder="Full Name" value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} />
          <input placeholder="Certification" value={form.certification} onChange={(e) => updateField("certification", e.target.value)} />
          <input placeholder="Organization" value={form.organization} onChange={(e) => updateField("organization", e.target.value)} />
          <input placeholder="Supervisor / Clinician" value={form.supervisor} onChange={(e) => updateField("supervisor", e.target.value)} />
          <input placeholder="State" value={form.state} onChange={(e) => updateField("state", e.target.value)} />

          <h3>Service Areas</h3>
          {[
            "Skill Acquisition",
            "Daily Living Support",
            "Social Skills",
            "Emotional Regulation",
            "Community Skills",
            "Vocational Skills",
          ].map((item) => (
            <label key={item}>
              <input
                type="checkbox"
                checked={serviceAreas.includes(item)}
                onChange={() => toggleArrayValue(item)}
              />{" "}
              {item}
            </label>
          ))}

          <button type="submit">Save and Continue</button>
        </form>
      </div>
    </div>
  );
}
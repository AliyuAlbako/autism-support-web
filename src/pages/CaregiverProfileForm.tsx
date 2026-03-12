import { useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

export default function CaregiverProfileForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    relationship: "",
    phone: "",
    city: "",
    state: "",
    livesWithIndividual: false,
    connectionPreference: "",
  });

  const [supportAreas, setSupportAreas] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);

  function updateField(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleArrayValue(
    value: string,
    current: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    if (current.includes(value)) {
      setter(current.filter((item) => item !== value));
    } else {
      setter([...current, value]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      role: "caregiver",
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, "caregiver_profiles", user.uid), {
      ...form,
      supportAreas,
      availability,
      createdAt: serverTimestamp(),
    });

    navigate("/caregiver");
  }

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 760, margin: "40px auto" }}>
        <h2 className="section-title">Caregiver Profile</h2>
        <p className="subtle">Step 2 of 3 — Caregiver Profile</p>

        <form onSubmit={handleSubmit} className="stack" style={{ marginTop: 20 }}>
          <h3>Basic Information</h3>
          <input placeholder="Full Name" value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} />
          <input placeholder="Phone Number" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
          <input placeholder="City" value={form.city} onChange={(e) => updateField("city", e.target.value)} />
          <input placeholder="State" value={form.state} onChange={(e) => updateField("state", e.target.value)} />

          <select
            value={form.relationship}
            onChange={(e) => updateField("relationship", e.target.value)}
            style={{ width: "100%", maxWidth: 420, padding: "12px 14px", border: "1px solid #e5e7eb", borderRadius: 12 }}
          >
            <option value="">Relationship to Individual</option>
            <option value="parent">Parent</option>
            <option value="sibling">Sibling</option>
            <option value="guardian">Guardian</option>
            <option value="residential-support-staff">Residential Support Staff</option>
            <option value="personal-aide">Personal Aide</option>
            <option value="other">Other</option>
          </select>

          <h3>Support Areas</h3>
          {[
            "Daily Living Skills",
            "Emotional Regulation",
            "Medication Routine",
            "Social Support",
            "Community Participation",
            "Employment Readiness",
          ].map((item) => (
            <label key={item}>
              <input
                type="checkbox"
                checked={supportAreas.includes(item)}
                onChange={() => toggleArrayValue(item, supportAreas, setSupportAreas)}
              />{" "}
              {item}
            </label>
          ))}

          <h3>Care Context</h3>
          <label>
            <input
              type="checkbox"
              checked={form.livesWithIndividual}
              onChange={(e) => updateField("livesWithIndividual", e.target.checked)}
            />{" "}
            Lives with autistic individual
          </label>

          <h3>Availability</h3>
          {["Morning", "Afternoon", "Evening", "Flexible"].map((item) => (
            <label key={item}>
              <input
                type="checkbox"
                checked={availability.includes(item)}
                onChange={() => toggleArrayValue(item, availability, setAvailability)}
              />{" "}
              {item}
            </label>
          ))}

          <h3>Connection Method</h3>
          <select
            value={form.connectionPreference}
            onChange={(e) => updateField("connectionPreference", e.target.value)}
            style={{ width: "100%", maxWidth: 420, padding: "12px 14px", border: "1px solid #e5e7eb", borderRadius: 12 }}
          >
            <option value="">How would you like to connect?</option>
            <option value="browse">Browse available individuals</option>
            <option value="invite">Enter invite code</option>
          </select>

          <button type="submit">Save and Continue</button>
        </form>
      </div>
    </div>
  );
}
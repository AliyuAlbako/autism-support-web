import { useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

export default function ClinicianProfileForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    title: "",
    license: "",
    stateOfPractice: "",
    organization: "",
    yearsOfExperience: "",
    acceptingRequests: false,
    city: "",
    state: "",
    remoteAvailable: false,
  });

  const [specialties, setSpecialties] = useState<string[]>([]);

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
      role: "clinician",
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, "clinician_profiles", user.uid), {
      ...form,
      specialties,
      createdAt: serverTimestamp(),
    });

    navigate("/clinician");
  }

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 760, margin: "40px auto" }}>
        <h2 className="section-title">Clinician Profile</h2>
        <p className="subtle">Step 2 of 3 — Clinician Profile</p>

        <form onSubmit={handleSubmit} className="stack" style={{ marginTop: 20 }}>
          <h3>Professional Information</h3>
          <input placeholder="Full Name" value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} />
          <input placeholder="License / Certification" value={form.license} onChange={(e) => updateField("license", e.target.value)} />
          <input placeholder="State of Practice" value={form.stateOfPractice} onChange={(e) => updateField("stateOfPractice", e.target.value)} />
          <input placeholder="Organization / Clinic" value={form.organization} onChange={(e) => updateField("organization", e.target.value)} />
          <input placeholder="Years of Experience" value={form.yearsOfExperience} onChange={(e) => updateField("yearsOfExperience", e.target.value)} />
          <input placeholder="City" value={form.city} onChange={(e) => updateField("city", e.target.value)} />
          <input placeholder="State" value={form.state} onChange={(e) => updateField("state", e.target.value)} />

          <select
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            style={{ width: "100%", maxWidth: 420, padding: "12px 14px", border: "1px solid #e5e7eb", borderRadius: 12 }}
          >
            <option value="">Professional Title</option>
            <option value="behavior-analyst">Behavior Analyst</option>
            <option value="bcba">BCBA</option>
            <option value="psychologist">Psychologist</option>
            <option value="therapist">Therapist</option>
            <option value="social-worker">Social Worker</option>
            <option value="other">Other Clinician</option>
          </select>

          <h3>Clinical Specialties</h3>
          {[
            "Behavioral Assessment",
            "Treatment Planning",
            "Behavior Intervention Planning",
            "Daily Living Skills",
            "Emotional Regulation",
            "Social Skills",
            "Vocational Readiness",
            "Caregiver Training",
          ].map((item) => (
            <label key={item}>
              <input
                type="checkbox"
                checked={specialties.includes(item)}
                onChange={() => toggleArrayValue(item, specialties, setSpecialties)}
              />{" "}
              {item}
            </label>
          ))}

          <h3>Availability</h3>
          <label>
            <input
              type="checkbox"
              checked={form.acceptingRequests}
              onChange={(e) => updateField("acceptingRequests", e.target.checked)}
            />{" "}
            Accepting support requests
          </label>

          <label>
            <input
              type="checkbox"
              checked={form.remoteAvailable}
              onChange={(e) => updateField("remoteAvailable", e.target.checked)}
            />{" "}
            Remote support available
          </label>

          <button type="submit">Save and Continue</button>
        </form>
      </div>
    </div>
  );
}
import { useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

export default function AdultProfileForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    city: "",
    state: "",
    phone: "",
    communicationStyle: "",
    discoverable: false,
    allowCaregiverRequests: false,
    allowClinicianRequests: false,
    shareRoutines: true,
    shareProgress: true,
    shareEmotions: false,
  });

  const [goals, setGoals] = useState<string[]>([]);
  const [programs, setPrograms] = useState<string[]>([]);
  const [supportPreferences, setSupportPreferences] = useState<string[]>([]);

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
      role: "adult",
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, "adult_profiles", user.uid), {
      ...form,
      goals,
      programs,
      supportPreferences,
      allowedRoles: {
        caregiver: form.allowCaregiverRequests,
        clinician: form.allowClinicianRequests,
      },
      sharingPermissions: {
        routines: form.shareRoutines,
        progress: form.shareProgress,
        emotions: form.shareEmotions,
      },
      createdAt: serverTimestamp(),
    });

    navigate("/adult");
  }

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 760, margin: "40px auto" }}>
        <h2 className="section-title">Complete Your Profile</h2>
        <p className="subtle">Step 2 of 3 — Autistic Individual Profile</p>

        <form onSubmit={handleSubmit} className="stack" style={{ marginTop: 20 }}>
          <h3>Basic Information</h3>
          <input placeholder="Full Name" value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} />
          <input type="date" value={form.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)} />
          <input placeholder="Gender" value={form.gender} onChange={(e) => updateField("gender", e.target.value)} />
          <input placeholder="City" value={form.city} onChange={(e) => updateField("city", e.target.value)} />
          <input placeholder="State" value={form.state} onChange={(e) => updateField("state", e.target.value)} />
          <input placeholder="Phone Number" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />

          <select
            value={form.communicationStyle}
            onChange={(e) => updateField("communicationStyle", e.target.value)}
            style={{ width: "100%", maxWidth: 420, padding: "12px 14px", border: "1px solid #e5e7eb", borderRadius: 12 }}
          >
            <option value="">Preferred Communication Style</option>
            <option value="verbal">Verbal</option>
            <option value="minimal-verbal">Minimal Verbal</option>
            <option value="aac">AAC / Assistive Communication</option>
            <option value="mixed">Mixed</option>
          </select>

          <h3>Support Goals</h3>
          {[
            "Daily Living Skills",
            "Emotional Regulation",
            "Communication",
            "Social Skills",
            "Employment Readiness",
            "Community Participation",
            "Self-Management",
          ].map((item) => (
            <label key={item}>
              <input
                type="checkbox"
                checked={goals.includes(item)}
                onChange={() => toggleArrayValue(item, goals, setGoals)}
              />{" "}
              {item}
            </label>
          ))}

          <h3>Current Programs</h3>
          {[
            "Communication Skills Program",
            "Self-Management Program",
            "Daily Living Skills Program",
            "Social Skills Program",
            "Vocational Skills Program",
            "Emotional Regulation Program",
            "Community Participation Program",
          ].map((item) => (
            <label key={item}>
              <input
                type="checkbox"
                checked={programs.includes(item)}
                onChange={() => toggleArrayValue(item, programs, setPrograms)}
              />{" "}
              {item}
            </label>
          ))}

          <h3>Support Preferences</h3>
          {[
            "Caregiver Support",
            "Clinical Support",
            "Therapy / Skill Training",
            "Case Management",
          ].map((item) => (
            <label key={item}>
              <input
                type="checkbox"
                checked={supportPreferences.includes(item)}
                onChange={() => toggleArrayValue(item, supportPreferences, setSupportPreferences)}
              />{" "}
              {item}
            </label>
          ))}

          <h3>Discovery Settings</h3>
          <label>
            <input
              type="checkbox"
              checked={form.discoverable}
              onChange={(e) => updateField("discoverable", e.target.checked)}
            />{" "}
            Allow professionals to discover my profile
          </label>

          <label>
            <input
              type="checkbox"
              checked={form.allowCaregiverRequests}
              onChange={(e) => updateField("allowCaregiverRequests", e.target.checked)}
            />{" "}
            Allow caregivers to request support
          </label>

          <label>
            <input
              type="checkbox"
              checked={form.allowClinicianRequests}
              onChange={(e) => updateField("allowClinicianRequests", e.target.checked)}
            />{" "}
            Allow clinicians to request support
          </label>

          <h3>Privacy & Consent</h3>
          <label>
            <input
              type="checkbox"
              checked={form.shareRoutines}
              onChange={(e) => updateField("shareRoutines", e.target.checked)}
            />{" "}
            Share routines after approval
          </label>

          <label>
            <input
              type="checkbox"
              checked={form.shareProgress}
              onChange={(e) => updateField("shareProgress", e.target.checked)}
            />{" "}
            Share progress summaries after approval
          </label>

          <label>
            <input
              type="checkbox"
              checked={form.shareEmotions}
              onChange={(e) => updateField("shareEmotions", e.target.checked)}
            />{" "}
            Share emotional regulation logs after approval
          </label>

          <button type="submit">Save and Continue</button>
        </form>
      </div>
    </div>
  );
}
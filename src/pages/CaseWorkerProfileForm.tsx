import { useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

export default function CaseWorkerProfileForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    organization: "",
    positionTitle: "",
    state: "",
    region: "",
  });

  const [services, setServices] = useState<string[]>([]);

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleArrayValue(value: string) {
    if (services.includes(value)) {
      setServices(services.filter((item) => item !== value));
    } else {
      setServices([...services, value]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      role: "caseworker",
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, "caseworker_profiles", user.uid), {
      ...form,
      services,
      createdAt: serverTimestamp(),
    });

    navigate("/caseworker");
  }

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 760, margin: "40px auto" }}>
        <h2 className="section-title">Case Worker Profile</h2>
        <p className="subtle">Step 2 of 3 — Case Worker / Case Manager</p>

        <form onSubmit={handleSubmit} className="stack" style={{ marginTop: 20 }}>
          <h3>Professional Information</h3>
          <input placeholder="Full Name" value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} />
          <input placeholder="Organization / Agency" value={form.organization} onChange={(e) => updateField("organization", e.target.value)} />
          <input placeholder="Position Title" value={form.positionTitle} onChange={(e) => updateField("positionTitle", e.target.value)} />
          <input placeholder="State" value={form.state} onChange={(e) => updateField("state", e.target.value)} />
          <input placeholder="Region" value={form.region} onChange={(e) => updateField("region", e.target.value)} />

          <h3>Services Coordinated</h3>
          {[
            "Housing",
            "Employment",
            "Community Programs",
            "Healthcare Access",
            "Benefits / Resources",
            "Family Support",
          ].map((item) => (
            <label key={item}>
              <input
                type="checkbox"
                checked={services.includes(item)}
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
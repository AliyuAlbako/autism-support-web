import { useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

export default function AdminProfileForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    organizationName: "",
    programType: "",
    city: "",
    state: "",
    clientsServed: "",
  });

  const [scope, setScope] = useState<string[]>([]);

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleArrayValue(value: string) {
    if (scope.includes(value)) {
      setScope(scope.filter((item) => item !== value));
    } else {
      setScope([...scope, value]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      role: "admin",
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, "admin_profiles", user.uid), {
      ...form,
      scope,
      createdAt: serverTimestamp(),
    });

    navigate("/admin");
  }

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 760, margin: "40px auto" }}>
        <h2 className="section-title">Program Administrator Profile</h2>
        <p className="subtle">Step 2 of 3 — Program Administrator</p>

        <form onSubmit={handleSubmit} className="stack" style={{ marginTop: 20 }}>
          <h3>Organization Information</h3>
          <input placeholder="Full Name" value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} />
          <input placeholder="Organization Name" value={form.organizationName} onChange={(e) => updateField("organizationName", e.target.value)} />
          <input placeholder="Program Type" value={form.programType} onChange={(e) => updateField("programType", e.target.value)} />
          <input placeholder="City" value={form.city} onChange={(e) => updateField("city", e.target.value)} />
          <input placeholder="State" value={form.state} onChange={(e) => updateField("state", e.target.value)} />
          <input placeholder="Number of Clients Served" value={form.clientsServed} onChange={(e) => updateField("clientsServed", e.target.value)} />

          <h3>Administrative Scope</h3>
          {[
            "Manage Clinicians",
            "Manage Case Workers",
            "Manage Support Teams",
            "Review Outcomes",
            "Program Analytics",
          ].map((item) => (
            <label key={item}>
              <input
                type="checkbox"
                checked={scope.includes(item)}
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
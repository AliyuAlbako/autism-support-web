import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Thank you. Your message has been recorded.");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 760, margin: "20px auto" }}>
        <h1 className="section-title">Contact Us</h1>
        <p className="subtle">
          Have a question, suggestion, or partnership inquiry? Send us a
          message.
        </p>

        <form onSubmit={handleSubmit} className="stack" style={{ marginTop: 20 }}>
          <div className="form-section">
            <label className="field-label">Your Name</label>
            <input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Enter your name"
              required
            />

            <label className="field-label">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="Enter your email"
              required
            />

            <label className="field-label">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              placeholder="Write your message here"
              rows={6}
              style={{
                width: "100%",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 12,
                resize: "vertical",
                fontFamily: "inherit",
              }}
              required
            />

            <div style={{ marginTop: 16 }}>
              <button type="submit">Send Message</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
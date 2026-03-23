import logo from "../assets/smaa-logo.png";

export default function About() {
  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 1000, margin: "20px auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img
            src={logo}
            alt="SMAA Logo"
            style={{ width: 120, marginBottom: 12 }}
          />
          <h1 className="section-title" style={{ marginBottom: 8 }}>
            About SMAA
          </h1>
          <p className="subtle" style={{ maxWidth: 700, margin: "0 auto" }}>
            Smart Monitoring for Autism Assistance is a support platform designed
            to help autistic individuals build independence while enabling
            caregivers, clinicians, and support teams to collaborate through
            structured routines, guided support, and progress tracking.
          </p>
        </div>

        <div className="grid grid-2">
          <div className="form-section">
            <h3>Our Mission</h3>
            <p className="subtle">
              To provide a structured, respectful, and person-centered digital
              system that supports autistic individuals in daily living,
              emotional regulation, communication, and long-term independence.
            </p>
          </div>

          <div className="form-section">
            <h3>Who the Platform Serves</h3>
            <p className="subtle">
              SMAA is designed for autistic individuals, caregivers, clinicians,
              therapists, case workers, and support programs working together to
              improve quality of life and meaningful outcomes.
            </p>
          </div>

          <div className="form-section">
            <h3>What the Platform Supports</h3>
            <ul className="list subtle">
              <li>Routine building and self-management</li>
              <li>Caregiver and clinician collaboration</li>
              <li>Support request and approval workflows</li>
              <li>Progress and activity tracking</li>
              <li>Structured onboarding for different roles</li>
            </ul>
          </div>

          <div className="form-section">
            <h3>Why It Matters</h3>
            <p className="subtle">
              Many tools focus on autism support in childhood, while autistic
              adults and their support systems remain underserved. SMAA is built
              to help close that gap with practical, coordinated support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
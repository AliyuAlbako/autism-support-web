// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function SelectRole() {
//   const [role, setRole] = useState("");
//   const navigate = useNavigate();

//   function handleContinue() {
//   if (!role) {
//     alert("Please select a role.");
//     return;
//   }

//   if (role === "adult") navigate("/onboarding/adult");
//   if (role === "caregiver") navigate("/onboarding/caregiver");
//   if (role === "clinician") navigate("/onboarding/clinician");
//   if (role === "therapist") navigate("/onboarding/therapist");
//   if (role === "caseworker") navigate("/onboarding/caseworker");
//   if (role === "admin") navigate("/onboarding/admin");
// }

//   return (
//     <div className="page">
//       <div className="card" style={{ maxWidth: 560, margin: "40px auto" }}>
//         <h2 className="section-title">Select Your Role</h2>
//         <p className="subtle">
//           Choose the role that best describes how you will use the platform.
//         </p>

//         <div className="stack" style={{ marginTop: 20 }}>
//           <select
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//             style={{
//               width: "100%",
//               maxWidth: 420,
//               padding: "12px 14px",
//               border: "1px solid #e5e7eb",
//               borderRadius: 12,
//               background: "white"
//             }}
//           >
//             <option value="">Select role</option>
//             <option value="adult">Autistic Individual</option>
//             <option value="caregiver">Caregiver</option>
//             <option value="clinician">Clinician / Behavior Analyst</option>
//             <option value="therapist">Therapist / Behavior Technician</option>
//             <option value="caseworker">Case Worker / Case Manager</option>
//             <option value="admin">Program Administrator</option>
//           </select>

//           <button onClick={handleContinue}>Continue</button>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";

export default function SelectRole() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  function handleContinue() {
    if (!role) {
      alert("Please select a role.");
      return;
    }

    navigate(`/onboarding/${role}`);
  }

  return (
    <OnboardingLayout
      title="Select Your Role"
      subtitle="Choose how you will use the platform."
    >
      <div className="stack" style={{ maxWidth: 460 }}>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 14px",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            background: "white",
          }}
        >
          <option value="">Select role</option>
          <option value="adult">Autistic Individual</option>
          <option value="caregiver">Caregiver</option>
          <option value="clinician">Clinician / Behavior Analyst</option>
          <option value="therapist">Therapist / Behavior Technician</option>
          <option value="caseworker">Case Worker / Case Manager</option>
          <option value="admin">Program Administrator</option>
        </select>

        <button onClick={handleContinue}>Continue</button>
      </div>
    </OnboardingLayout>
  );
}
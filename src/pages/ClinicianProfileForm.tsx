import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import ProgressSteps from "../components/onboarding/ProgressSteps";
import CheckboxGroup from "../components/onboarding/CheckboxGroup";
import MultiStepActions from "../components/onboarding/MultiStepActions";
import { saveRoleProfile, saveUserRole } from "../services/onboarding";

const stepLabels = ["Identity", "Experience", "Services", "Availability"];

export default function ClinicianProfileForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    preferredName: "",
    dateOfBirth: "",
    professionalTitle: "",
    phone: "",
    email: user?.email || "",
    city: "",
    state: "",
    preferredCommunication: "",
    yearsOfExperience: "",
    workType: "",
    maxCaseload: "",
  });

  const [expertise, setExpertise] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [daysAvailable, setDaysAvailable] = useState<string[]>([]);

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleValue(
    value: string,
    current: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    setter(
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  }

  function nextStep() {
    setStep((prev) => Math.min(prev + 1, stepLabels.length));
  }

  function prevStep() {
    setStep((prev) => Math.max(prev - 1, 1));
  }

  function canProceed() {
    if (step === 1) {
      return form.fullName && form.professionalTitle && form.phone;
    }

    if (step === 2) {
      return form.yearsOfExperience && expertise.length > 0;
    }

    if (step === 3) {
      return services.length > 0;
    }

    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (step < stepLabels.length) {
      if (!canProceed()) {
        alert("Please complete required fields before continuing.");
        return;
      }

      nextStep();
      return;
    }

    if (!user) return;

    try {
      setLoading(true);

      await saveUserRole(user.uid, user.email, "clinician");

      await saveRoleProfile("clinician_profiles", user.uid, {
        ...form,
        expertise,
        services,
        daysAvailable,
      });

      navigate("/clinician");
    } finally {
      setLoading(false);
    }
  }

  return (
    <OnboardingLayout
      title="Clinician Profile"
      subtitle="Set up your clinical profile to begin supporting participants."
    >
      <ProgressSteps
        currentStep={step}
        totalSteps={stepLabels.length}
        labels={stepLabels}
      />

      <form onSubmit={handleSubmit} className="stack">
        {/* STEP 1 */}
        {step === 1 && (
          <div className="step-shell">
            <div className="top-banner">
              <strong>Professional Identity</strong>
              <p className="step-note" style={{ marginBottom: 0 }}>
                Enter your professional and contact details.
              </p>
            </div>

            <div className="form-section">
              <h3>Basic Information</h3>

              <label className="field-label">Full Name</label>
              <input
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
              />

              <label className="field-label">Preferred Name</label>
              <input
                value={form.preferredName}
                onChange={(e) => updateField("preferredName", e.target.value)}
              />

              <label className="field-label">Date of Birth</label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => updateField("dateOfBirth", e.target.value)}
              />

              <label className="field-label">Professional Title</label>
              <select
                value={form.professionalTitle}
                onChange={(e) =>
                  updateField("professionalTitle", e.target.value)
                }
              >
                <option value="">Select Title</option>
                <option value="BCBA">Board Certified Behavior Analyst (BCBA)</option>
                <option value="Licensed Psychologist">Licensed Psychologist</option>
                <option value="LCSW">Clinical Social Worker (LCSW)</option>
                <option value="RBT">Behavior Technician (RBT)</option>
                <option value="Occupational Therapist">Occupational Therapist</option>
                <option value="Speech Therapist">Speech Therapist</option>
                <option value="Psychiatrist">Psychiatrist</option>
                <option value="Developmental Specialist">Developmental Specialist</option>
              </select>

              <label className="field-label">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />

              <label className="field-label">Email</label>
              <input
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />

              <label className="field-label">City</label>
              <input
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
              />

              <label className="field-label">State</label>
              <input
                value={form.state}
                onChange={(e) => updateField("state", e.target.value)}
              />

              <label className="field-label">Preferred Communication</label>
              <select
                value={form.preferredCommunication}
                onChange={(e) =>
                  updateField("preferredCommunication", e.target.value)
                }
              >
                <option value="">Select method</option>
                <option value="Phone">Phone</option>
                <option value="Email">Email</option>
                <option value="Text">Text</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="step-shell">
            <div className="top-banner">
              <strong>Experience & Expertise</strong>
              <p className="step-note" style={{ marginBottom: 0 }}>
                Tell us about your background in autism support.
              </p>
            </div>

            <div className="form-section">
              <h3>Experience</h3>

              <label className="field-label">Years of Experience</label>
              <select
                value={form.yearsOfExperience}
                onChange={(e) =>
                  updateField("yearsOfExperience", e.target.value)
                }
              >
                <option value="">Select experience</option>
                <option value="Less than 1 year">Less than 1 year</option>
                <option value="1–3 years">1–3 years</option>
                <option value="3–5 years">3–5 years</option>
                <option value="5–10 years">5–10 years</option>
                <option value="More than 10 years">More than 10 years</option>
              </select>
            </div>

            <div className="form-section">
              <h3>Areas of Expertise</h3>

              <CheckboxGroup
                options={[
                  "Applied Behavior Analysis (ABA)",
                  "Functional Behavior Assessment (FBA)",
                  "Behavior Intervention Plans (BIP)",
                  "Social Skills Training",
                  "Communication interventions",
                  "Sensory integration",
                  "Life skills training",
                  "Adult autism support services",
                  "Crisis intervention",
                ]}
                values={expertise}
                onToggle={(value) => toggleValue(value, expertise, setExpertise)}
              />
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="step-shell">
            <div className="top-banner">
              <strong>Services</strong>
              <p className="step-note" style={{ marginBottom: 0 }}>
                Select the services you can provide.
              </p>
            </div>

            <div className="form-section">
              <h3>Service Offerings</h3>

              <CheckboxGroup
                options={[
                  "Behavioral assessment",
                  "Functional Behavior Assessment (FBA)",
                  "Behavior Intervention Plan development",
                  "Individual therapy",
                  "Social skills groups",
                  "Caregiver training",
                  "Program supervision",
                  "Clinical consultation",
                  "Staff training",
                ]}
                values={services}
                onToggle={(value) => toggleValue(value, services, setServices)}
              />
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="step-shell">
            <div className="top-banner">
              <strong>Availability</strong>
              <p className="step-note" style={{ marginBottom: 0 }}>
                Define how and when you can work.
              </p>
            </div>

            <div className="form-section">
              <h3>Work Preferences</h3>

              <label className="field-label">Work Type</label>
              <select
                value={form.workType}
                onChange={(e) => updateField("workType", e.target.value)}
              >
                <option value="">Select type</option>
                <option value="Full time">Full time</option>
                <option value="Part time">Part time</option>
                <option value="Contract">Contract</option>
              </select>

              <label className="field-label">Days Available</label>
              <CheckboxGroup
                options={[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Weekend availability",
                ]}
                values={daysAvailable}
                onToggle={(value) =>
                  toggleValue(value, daysAvailable, setDaysAvailable)
                }
              />

              <label className="field-label">Maximum Caseload</label>
              <input
                placeholder="e.g. 5 clients"
                value={form.maxCaseload}
                onChange={(e) => updateField("maxCaseload", e.target.value)}
              />
            </div>
          </div>
        )}

        <MultiStepActions
          canGoBack={step > 1}
          isLastStep={step === stepLabels.length}
          loading={loading}
          onBack={prevStep}
        />
      </form>
    </OnboardingLayout>
  );
}
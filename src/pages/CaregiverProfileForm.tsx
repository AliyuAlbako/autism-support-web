import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import ProgressSteps from "../components/onboarding/ProgressSteps";
import CheckboxGroup from "../components/onboarding/CheckboxGroup";
import MultiStepActions from "../components/onboarding/MultiStepActions";
import { saveRoleProfile, saveUserRole } from "../services/onboarding";

const stepLabels = ["Identity", "Relationship", "Responsibilities"];

export default function CaregiverProfileForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    preferredName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: user?.email || "",
    city: "",
    state: "",
    preferredCommunication: "",
    relationship: "",
    careDuration: "",
  });

  const [responsibilities, setResponsibilities] = useState<string[]>([]);

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleResponsibility(value: string) {
    setResponsibilities((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
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
      return form.fullName && form.phone && form.city;
    }

    if (step === 2) {
      return form.relationship && form.careDuration;
    }

    if (step === 3) {
      return responsibilities.length > 0;
    }

    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (step < stepLabels.length) {
      if (!canProceed()) {
        alert("Please complete the required fields before continuing.");
        return;
      }

      nextStep();
      return;
    }

    if (!user) return;

    try {
      setLoading(true);

      await saveUserRole(user.uid, user.email, "caregiver");

      await saveRoleProfile("caregiver_profiles", user.uid, {
        ...form,
        responsibilities,
      });

      navigate("/caregiver");
    } finally {
      setLoading(false);
    }
  }

  return (
    <OnboardingLayout
      title="Caregiver Profile"
      subtitle="Tell us how you support autistic individuals."
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
              <strong>Caregiver Information</strong>
              <p className="step-note" style={{ marginBottom: 0 }}>
                Tell us who you are and how we can contact you.
              </p>
            </div>

            <div className="form-section">
              <h3>Personal Details</h3>

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

              <label className="field-label">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => updateField("gender", e.target.value)}
              >
                <option value="">Gender (optional)</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
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
              <strong>Relationship & Experience</strong>
              <p className="step-note" style={{ marginBottom: 0 }}>
                Describe your connection and caregiving experience.
              </p>
            </div>

            <div className="form-section">
              <h3>Care Relationship</h3>

              <label className="field-label">Relationship</label>
              <select
                value={form.relationship}
                onChange={(e) => updateField("relationship", e.target.value)}
              >
                <option value="">Select relationship</option>
                <option value="Parent">Parent</option>
                <option value="Spouse">Spouse</option>
                <option value="Sibling">Sibling</option>
                <option value="Professional Caregiver">
                  Professional Caregiver
                </option>
                <option value="Legal Guardian">Legal Guardian</option>
                <option value="Other">Other</option>
              </select>

              <label className="field-label">Care Duration</label>
              <select
                value={form.careDuration}
                onChange={(e) => updateField("careDuration", e.target.value)}
              >
                <option value="">Select duration</option>
                <option value="Less than 6 months">Less than 6 months</option>
                <option value="6 months – 1 year">6 months – 1 year</option>
                <option value="1–3 years">1–3 years</option>
                <option value="3–5 years">3–5 years</option>
                <option value="More than 5 years">More than 5 years</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="step-shell">
            <div className="top-banner">
              <strong>Responsibilities</strong>
              <p className="step-note" style={{ marginBottom: 0 }}>
                Select the areas you currently support.
              </p>
            </div>

            <div className="form-section">
              <h3>Care Responsibilities</h3>

              <CheckboxGroup
                options={[
                  "Personal care",
                  "Medication management",
                  "Meal preparation",
                  "Transportation",
                  "Behavioral support",
                  "Communication support",
                  "Financial support",
                  "Medical appointment coordination",
                  "Community integration support",
                  "Safety supervision",
                ]}
                values={responsibilities}
                onToggle={toggleResponsibility}
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
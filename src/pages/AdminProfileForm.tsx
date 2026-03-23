import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import ProgressSteps from "../components/onboarding/ProgressSteps";
import CheckboxGroup from "../components/onboarding/CheckboxGroup";
import MultiStepActions from "../components/onboarding/MultiStepActions";
import { saveRoleProfile, saveUserRole } from "../services/onboarding";

const stepLabels = ["Identity", "Communication", "Goals", "Discovery"];

export default function AdultProfileForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    preferredName: "",
    dateOfBirth: "",
    gender: "",
    primaryDiagnosis: "",
    secondaryDiagnoses: "",
    primaryLanguage: "",
    communicationMethod: "",
    mobility: "",
    discoverable: false,
    allowCaregiverRequests: false,
    allowClinicianRequests: false,
    allowTherapistRequests: false,
    allowCaseworkerRequests: false,
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
      return (
        form.fullName.trim() &&
        form.dateOfBirth.trim() &&
        form.primaryDiagnosis.trim()
      );
    }

    if (step === 2) {
      return (
        form.primaryLanguage.trim() &&
        form.communicationMethod.trim() &&
        form.mobility.trim()
      );
    }

    if (step === 3) {
      return goals.length > 0;
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

      await saveUserRole(user.uid, user.email, "adult");

      await saveRoleProfile("adult_profiles", user.uid, {
        ...form,
        goals,
        programs,
        supportPreferences,
        allowedRoles: {
          caregiver: form.allowCaregiverRequests,
          clinician: form.allowClinicianRequests,
          therapist: form.allowTherapistRequests,
          caseworker: form.allowCaseworkerRequests,
        },
        sharingPermissions: {
          routines: form.shareRoutines,
          progress: form.shareProgress,
          emotions: form.shareEmotions,
        },
      });

      navigate("/adult");
    } finally {
      setLoading(false);
    }
  }

  return (
    <OnboardingLayout
      title="Participant Profile"
      subtitle="Complete your profile to begin receiving structured support."
    >
      <ProgressSteps
        currentStep={step}
        totalSteps={stepLabels.length}
        labels={stepLabels}
      />

      <form onSubmit={handleSubmit} className="stack">
        {step === 1 && (
          <div className="step-shell">
            <div className="top-banner">
              <strong>Participant Intake</strong>
              <p className="step-note" style={{ marginBottom: 0 }}>
                Start with basic identity and diagnosis details.
              </p>
            </div>

            <div className="form-section">
              <h3>Basic Information</h3>

              <label className="field-label">Full Name</label>
              <input
                placeholder="Full Name"
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
              />

              <label className="field-label">Preferred Name</label>
              <input
                placeholder="Preferred Name"
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
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>

              <label className="field-label">Primary Diagnosis</label>
              <select
                value={form.primaryDiagnosis}
                onChange={(e) => updateField("primaryDiagnosis", e.target.value)}
              >
                <option value="">Primary Diagnosis</option>
                <option value="Autism Spectrum Disorder">
                  Autism Spectrum Disorder
                </option>
                <option value="Intellectual Disability">
                  Intellectual Disability
                </option>
                <option value="Developmental Disability">
                  Developmental Disability
                </option>
                <option value="Other">Other</option>
              </select>

              <label className="field-label">
                Secondary Diagnoses (optional)
              </label>
              <input
                placeholder="Secondary Diagnoses (optional)"
                value={form.secondaryDiagnoses}
                onChange={(e) =>
                  updateField("secondaryDiagnoses", e.target.value)
                }
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-shell">
            <div className="top-banner">
              <strong>Communication Profile</strong>
              <p className="step-note" style={{ marginBottom: 0 }}>
                Tell us how the participant communicates and moves through daily
                environments.
              </p>
            </div>

            <div className="form-section">
              <h3>Communication & Ability</h3>

              <label className="field-label">Primary Language</label>
              <input
                placeholder="Primary Language"
                value={form.primaryLanguage}
                onChange={(e) => updateField("primaryLanguage", e.target.value)}
              />

              <label className="field-label">Communication Method</label>
              <select
                value={form.communicationMethod}
                onChange={(e) =>
                  updateField("communicationMethod", e.target.value)
                }
              >
                <option value="">Communication Method</option>
                <option value="Verbal">Verbal</option>
                <option value="Limited Speech">Limited Speech</option>
                <option value="Non-verbal">Non-verbal</option>
                <option value="AAC Device">AAC Device</option>
                <option value="Sign Language">Sign Language</option>
              </select>

              <label className="field-label">Mobility</label>
              <select
                value={form.mobility}
                onChange={(e) => updateField("mobility", e.target.value)}
              >
                <option value="">Mobility</option>
                <option value="Independent walking">Independent walking</option>
                <option value="Uses mobility aid">Uses mobility aid</option>
                <option value="Wheelchair">Wheelchair</option>
                <option value="Needs assistance">Needs assistance</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-shell">
            <div className="top-banner">
              <strong>Goals & Programs</strong>
              <p className="step-note" style={{ marginBottom: 0 }}>
                Select the areas the participant is currently working on.
              </p>
            </div>

            <div className="form-section">
              <h3>Support Goals</h3>
              <p className="inline-help">
                Choose one or more goals for independence and development.
              </p>

              <CheckboxGroup
                options={[
                  "Independent living skills",
                  "Social skills",
                  "Communication",
                  "Behavior regulation",
                  "Community integration",
                  "Employment readiness",
                  "Life skills training",
                ]}
                values={goals}
                onToggle={(value) => toggleArrayValue(value, goals, setGoals)}
              />
            </div>

            <div className="form-section">
              <h3>Current Programs</h3>
              <p className="inline-help">
                Select the support programs the participant is currently involved
                in.
              </p>

              <CheckboxGroup
                options={[
                  "Communication Skills Program",
                  "Self-Management Program",
                  "Daily Living Skills Program",
                  "Social Skills Program",
                  "Vocational Skills Program",
                  "Emotional Regulation Program",
                  "Community Participation Program",
                ]}
                values={programs}
                onToggle={(value) =>
                  toggleArrayValue(value, programs, setPrograms)
                }
              />
            </div>

            <div className="form-section">
              <h3>Support Preferences</h3>
              <p className="inline-help">
                Indicate the types of support the participant is open to
                receiving.
              </p>

              <CheckboxGroup
                options={[
                  "Caregiver Support",
                  "Clinical Support",
                  "Therapy / Skill Training",
                  "Case Management",
                ]}
                values={supportPreferences}
                onToggle={(value) =>
                  toggleArrayValue(
                    value,
                    supportPreferences,
                    setSupportPreferences
                  )
                }
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="step-shell">
            <div className="top-banner">
              <strong>Discovery & Privacy</strong>
              <p className="step-note" style={{ marginBottom: 0 }}>
                Control who can find this participant and what information may be
                shared after approval.
              </p>
            </div>

            <div className="form-section">
              <h3>Discovery Settings</h3>

              <label className="checkbox-card">
                <input
                  type="checkbox"
                  checked={form.discoverable}
                  onChange={(e) =>
                    updateField("discoverable", e.target.checked)
                  }
                />
                <span>Allow professionals to discover my profile</span>
              </label>

              <div className="stack" style={{ marginTop: 12 }}>
                <label className="checkbox-card">
                  <input
                    type="checkbox"
                    checked={form.allowCaregiverRequests}
                    onChange={(e) =>
                      updateField("allowCaregiverRequests", e.target.checked)
                    }
                  />
                  <span>Allow caregivers to request support</span>
                </label>

                <label className="checkbox-card">
                  <input
                    type="checkbox"
                    checked={form.allowClinicianRequests}
                    onChange={(e) =>
                      updateField("allowClinicianRequests", e.target.checked)
                    }
                  />
                  <span>Allow clinicians to request support</span>
                </label>

                <label className="checkbox-card">
                  <input
                    type="checkbox"
                    checked={form.allowTherapistRequests}
                    onChange={(e) =>
                      updateField("allowTherapistRequests", e.target.checked)
                    }
                  />
                  <span>Allow therapists to request support</span>
                </label>

                <label className="checkbox-card">
                  <input
                    type="checkbox"
                    checked={form.allowCaseworkerRequests}
                    onChange={(e) =>
                      updateField("allowCaseworkerRequests", e.target.checked)
                    }
                  />
                  <span>Allow case workers to request support</span>
                </label>
              </div>
            </div>

            <div className="form-section">
              <h3>Sharing Permissions</h3>
              <p className="inline-help">
                These permissions apply after a support request has been
                approved.
              </p>

              <div className="stack">
                <label className="checkbox-card">
                  <input
                    type="checkbox"
                    checked={form.shareRoutines}
                    onChange={(e) =>
                      updateField("shareRoutines", e.target.checked)
                    }
                  />
                  <span>Share routines after approval</span>
                </label>

                <label className="checkbox-card">
                  <input
                    type="checkbox"
                    checked={form.shareProgress}
                    onChange={(e) =>
                      updateField("shareProgress", e.target.checked)
                    }
                  />
                  <span>Share progress summaries after approval</span>
                </label>

                <label className="checkbox-card">
                  <input
                    type="checkbox"
                    checked={form.shareEmotions}
                    onChange={(e) =>
                      updateField("shareEmotions", e.target.checked)
                    }
                  />
                  <span>Share emotional regulation logs after approval</span>
                </label>
              </div>
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
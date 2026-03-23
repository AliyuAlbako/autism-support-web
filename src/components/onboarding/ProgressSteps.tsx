interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export default function ProgressSteps({
  currentStep,
  totalSteps,
  labels,
}: ProgressStepsProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${totalSteps}, 1fr)`,
          gap: 10,
          marginBottom: 10,
        }}
      >
        {labels.map((label, index) => {
          const active = index + 1 <= currentStep;
          return (
            <div
              key={label}
              style={{
                background: active ? "#0f62fe" : "#e5e7eb",
                color: active ? "#fff" : "#374151",
                borderRadius: 999,
                padding: "10px 12px",
                fontSize: 13,
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              {label}
            </div>
          );
        })}
      </div>

      <p className="subtle" style={{ margin: 0 }}>
        Step {currentStep} of {totalSteps}
      </p>
    </div>
  );
}
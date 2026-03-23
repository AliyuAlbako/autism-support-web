interface MultiStepActionsProps {
  canGoBack: boolean;
  isLastStep: boolean;
  loading?: boolean;
  onBack: () => void;
}

export default function MultiStepActions({
  canGoBack,
  isLastStep,
  loading = false,
  onBack,
}: MultiStepActionsProps) {
  return (
    <div className="form-actions">
      <button
        type="button"
        className="secondary"
        onClick={onBack}
        disabled={!canGoBack || loading}
      >
        Back
      </button>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : isLastStep ? "Save and Continue" : "Next"}
      </button>
    </div>
  );
}
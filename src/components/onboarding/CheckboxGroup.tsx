interface CheckboxGroupProps {
  options: string[];
  values: string[];
  onToggle: (value: string) => void;
}

export default function CheckboxGroup({
  options,
  values,
  onToggle,
}: CheckboxGroupProps) {
  return (
    <div className="checkbox-card-grid">
      {options.map((option) => (
        <label key={option} className="checkbox-card">
          <input
            type="checkbox"
            checked={values.includes(option)}
            onChange={() => onToggle(option)}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}
export default function FormInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder = "",
  maxLength,
  minLength,
  min,
  max,
  step,
  autoComplete,
}) {
  return (
    <div className="form-field">
      <label htmlFor={name}>
        {label}
        {required && <span className="required-mark">*</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        minLength={minLength}
        min={min}
        max={max}
        step={step}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
      />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

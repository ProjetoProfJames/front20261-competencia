export default function FormInput({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  min,
  max,
}) {
  return (
    <label>
      <span>{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
      />
    </label>
  );
}

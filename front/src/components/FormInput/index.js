export default function FormInput({ label, type, name, value, onChange, required, disabled }) {
  return (
    <label>
      {label}
      <input type={type} name={name} value={value} onChange={onChange} required={required} disabled={disabled} />
    </label>
  );
}
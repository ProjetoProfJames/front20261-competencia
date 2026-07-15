export default function FormInput({ label, type, name, value, onChange, required }) {
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input id={name} type={type} name={name} value={value} onChange={onChange} required={required} />
    </div>
  );
}

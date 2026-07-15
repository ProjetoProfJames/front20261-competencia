export default function FormInput({ label, type, name, value, onChange, disabled }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input className="input-field" type={type} name={name} value={value} onChange={onChange} disabled={disabled} />
    </div>
  );
}
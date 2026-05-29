export default function FormInput({ label, type, name, value, onChange }) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} />
    </div>
  );
}
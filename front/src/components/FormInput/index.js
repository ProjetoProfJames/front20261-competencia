export default function FormInput({ label, type, name, value, onChange }) {
  return (
    <div class="form-group">
      <label>{label}</label>
      <input class="input-field" type={type} name={name} value={value} onChange={onChange} />
    </div>
  );
}
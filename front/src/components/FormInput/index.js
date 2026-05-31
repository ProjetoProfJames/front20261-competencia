export default function FormInput({ label, type = "text", name, value, onChange, placeholder, disabled = false, required = false, children, as = "input", helperText }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {as === "select" ? (
        <select className="field__control" name={name} value={value} onChange={onChange} disabled={disabled} required={required}>
          {children}
        </select>
      ) : (
        <input className="field__control" type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} required={required} />
      )}
      {helperText ? <span className="field__help">{helperText}</span> : null}
    </label>
  );
}
const FormInput = ({ label, type, name, value, onChange }) => (
  <div className="form-group">
    <label>{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} />
  </div>
);

export default FormInput;

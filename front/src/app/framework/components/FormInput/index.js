import styles from './form.module.css';

export default function FormInput({ label, type, name, placeholder, value, onChange }) {
  switch (type) {
    case "label":
      return (
        <label htmlFor={name} className={styles.label}>
          {label}
        </label> 
      );
    case "input":
      return (
        <input
          type="text"
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={styles.input}
        />
      );
      case "form-group":
        return (
          <div className={styles['formGroup']}>
            {label && <label htmlFor={name} className={styles.label}>{label}</label>}
            <input
              type="text"
              id={name}
              name={name}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              className={styles.input}
            />
          </div>
        );
    default:
      return null;
  }
}
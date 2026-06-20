'use client';
import styles from './FormInput.module.css';

export default function FormInput({ label, type = 'text', name, value, onChange, required, error, placeholder, options, multiple }) {
  if (type === 'select') {
    return (
      <div className={styles.group}>
        {label && <label className={styles.label}>{label}{required && <span className={styles.req}>*</span>}</label>}
        <select
          name={name}
          value={value}
          onChange={onChange}
          multiple={multiple}
          className={`${styles.input} ${error ? styles.hasError : ''}`}
        >
          {!multiple && <option value="">Selecione...</option>}
          {(options || []).map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }

  return (
    <div className={styles.group}>
      {label && <label className={styles.label}>{label}{required && <span className={styles.req}>*</span>}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.hasError : ''}`}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

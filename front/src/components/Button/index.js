'use client';
import styles from './Button.module.css';

export default function Button({ type = 'button', onClick, children, variant = 'primary', disabled, small }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.btn} ${styles[variant]} ${small ? styles.small : ''}`}
    >
      {children}
    </button>
  );
}

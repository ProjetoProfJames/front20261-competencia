"use client";

import styles from './button.module.css';

export default function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
  ...props
}) {
  const htmlTypes = new Set(["button", "submit", "reset"]);

  const variantStyles = {
    primary: styles.btnprimary,
    secondary: styles.btnsecondary,
    danger: styles.btntertiary
  };

  const resolvedType = htmlTypes.has(type) ? type : "button";
  const resolvedClassName = `${variantStyles[variant] || styles.btnprimary} ${className}`.trim();

  return (
    <button
      type={resolvedType}
      onClick={onClick}
      className={resolvedClassName}
      {...props}
    >
      {children}
    </button>
  );
}
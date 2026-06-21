"use client";

import styles from './button.module.css';

export default function Button({
  children,
  onClick,
  variant,
  type = "button",
  className = "",
  ...props
}) {
  const htmlTypes = new Set(["button", "submit", "reset"]);
  const legacyStyles = {
    azul: styles.btnprimary,
    laranja: styles.btnsecondary,
    vermelho: styles.btntertiary,
  };
  const modernStyles = {
    primary: "btn-primary",
    success: "btn-success",
    danger: "btn-danger",
  };

  const styleVariant =
    variant && (legacyStyles[variant] || modernStyles[variant])
      ? variant
      : type && (legacyStyles[type] || modernStyles[type])
        ? type
        : "primary";

  const resolvedType = htmlTypes.has(type) ? type : "button";
  const resolvedClassName = legacyStyles[styleVariant]
    ? `${legacyStyles[styleVariant]} ${className}`.trim()
    : `${"btn px-8 py-3 text-base font-medium transition-all duration-300"} ${modernStyles[styleVariant] || modernStyles.primary} ${className}`.trim();

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
const variantStyles = {
  default: { backgroundColor: "#007bff", color: "white", border: "none" },
  danger:  { backgroundColor: "#dc3545", color: "white", border: "none" },
  secondary: { backgroundColor: "#6c757d", color: "white", border: "none" },
  success: { backgroundColor: "#28a745", color: "white", border: "none" },
};

export default function Button({
  type = "button",
  onClick,
  children,
  variant = "default",
  disabled = false,
  style = {},
}) {
  const base = {
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    fontSize: "14px",
    fontWeight: "500",
    transition: "opacity 0.15s",
    ...( variantStyles[variant] || variantStyles.default ),
    ...style,
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} style={base}>
      {children}
    </button>
  );
}

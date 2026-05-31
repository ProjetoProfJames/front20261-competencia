export default function Button({ type = "button", onClick, children, variant = "primary", fullWidth = false, disabled = false }) {
  const className = ["ui-button", `ui-button--${variant}`, fullWidth ? "ui-button--full" : ""].filter(Boolean).join(" ");

  return (
    <button type={type} onClick={onClick} className={className} disabled={disabled}>
      {children}
    </button>
  );
}
export default function Button({
  type = "button",
  onClick,
  children,
  disabled = false,
}) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export default function Button({ type, onClick, disabled, children }) {
  const label = typeof children === "string" ? children.toLowerCase() : "";
  const isSecondary = ["excluir", "excluindo", "voltar", "logout"].some((text) =>
    label.includes(text)
  );

  return (
    <button
      className={isSecondary ? "button-secondary" : "button-primary"}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default function Button({ type, onClick, disabled, children }) {
  return (
    <button className="button-simples" type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

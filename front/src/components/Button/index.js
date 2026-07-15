export default function Button({ type, onClick, children, disabled, className }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  );
}
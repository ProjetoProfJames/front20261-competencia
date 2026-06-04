export default function Button({ children, type, onClick }) {
  return (
    <button class="btn btn-primary" type={type} onClick={onClick}>
      {children}
    </button>
  );
}
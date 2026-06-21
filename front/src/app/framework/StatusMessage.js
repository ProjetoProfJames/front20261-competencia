export default function StatusMessage({ type = "erro", children }) {
  if (!children) {
    return null;
  }

  return <p className={`status-message ${type}`}>{children}</p>;
}

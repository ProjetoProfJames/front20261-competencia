export default function Button(props) {
  const text = props.children ? props.children.toString().trim() : "";
  const isSaveOrUpdate = text === "Salvar" || text === "Atualizar";

  const successStyle = isSaveOrUpdate ? {
    backgroundColor: "#16a34a",
    color: "#ffffff"
  } : {};

  return (
    <button 
      className={`btn ${props.className || 'btn-primary'}`} 
      type={props.type} 
      onClick={props.onClick}
      style={successStyle}
    >
      {props.children}
    </button>
  );
}
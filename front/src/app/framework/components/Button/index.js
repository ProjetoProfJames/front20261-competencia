import styles from './button.module.css';

export default function Button({ type, onClick, children }) {
  let estilo = "";

  switch (type) {
    case "azul":
      estilo = styles.btnprimary
      break;
    case "laranja":
      estilo = styles.btnsecondary
      break;
    case "vermelho":
      estilo = styles.btntertiary
      break;
    default:
      estilo = styles.btnprimary
      break;
  }

  return (
    <button className={estilo} onClick={onClick} >
      {children}
    </button>
  )
}

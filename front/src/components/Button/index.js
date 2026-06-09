export default function Button({ type, onClick, children, variant = 'primary' }) {
  const classes = {
    primary: 'btn btn-primary',
    outline: 'btn btn-outline',
    danger: 'btn btn-danger',
  };

  return (
    <button type={type} onClick={onClick} className={classes[variant] || 'btn btn-primary'}>
      {children}
    </button>
  );
}
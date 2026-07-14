const VARIANT_CLASSES = {
  primary: "btn btn-primary",
  outline: "btn btn-outline",
  danger: "btn btn-danger",
  warning: "btn btn-warning",
};

const Button = ({ type, onClick, children, variant = "primary", disabled = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary}
  >
    {children}
  </button>
);

export default Button;

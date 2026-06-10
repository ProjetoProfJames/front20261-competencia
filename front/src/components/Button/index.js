export default function Button({
  type = "button",
  onClick,
  children,
  variant = "primary",
  disabled = false,
  className = "",
}) {
  const classes = ["button", `button-${variant}`, className].filter(Boolean).join(" ");

  return (
    <button className={classes} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

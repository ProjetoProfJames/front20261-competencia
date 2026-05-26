import Link from "next/link";

export default function Button({ type, onClick, href, children, ...props }) {

if (href) {
    return (
      <Link href={href} className="btn-custom" onClick={onClick} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className="btn-custom" {...props}>
      {children}
    </button>
  );
}
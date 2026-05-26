import Link from "next/link";

export default function Button({ type, onClick, href, children }) {

  if (href) {
    return (
      <Link href={href} className="btn-custom">
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className="btn-custom">
      {children}
    </button>
  );
}
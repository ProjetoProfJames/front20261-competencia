
import Link from "next/link";

export default function OptionLink({ href = "/", label = "" }) {
    return (
        <Link
            href={href}
            className="hover:underline opacity-80 hover:opacity-100"
        >
            {label}
        </Link>
    );
}
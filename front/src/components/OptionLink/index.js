
import Link from "next/link";

export default function OptionLink({ href = "/", label = "" }) {
    return (
        <Link
            href={href}
        >
            {label}
        </Link>
    );
}
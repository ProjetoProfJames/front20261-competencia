"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const Menu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) setAccount(JSON.parse(raw));
  }, []);

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const linkIsActive = (href) => pathname?.startsWith(href);

  const canSeeUsers = account?.profile === "ADMIN" || account?.profile === "PROFESSOR";
  const canSeeLocations = account?.profile === "ADMIN" || account?.profile === "COORDENADOR";

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">P</span>
        <span className="sidebar-brand-text">
          <strong>PIE Manager</strong>
          <span>Gestão Acadêmica</span>
        </span>
      </div>

      <ul className="sidebar-nav">
        <li>
          <Link href="/dashboard" className={linkIsActive("/dashboard") ? "active" : ""}>
            Dashboard
          </Link>
        </li>

        {canSeeUsers && (
          <li>
            <Link href="/users" className={linkIsActive("/users") ? "active" : ""}>
              Usuários
            </Link>
          </li>
        )}

        {canSeeLocations && (
          <li>
            <Link href="/locais" className={linkIsActive("/locais") ? "active" : ""}>
              Locais
            </Link>
          </li>
        )}
      </ul>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="sidebar-user-avatar">{account?.username?.charAt(0) || "?"}</span>
          <span className="sidebar-user-name">
            {account?.username || "Usuário"}
            <span>{account?.profile}</span>
          </span>
        </div>
        <button className="btn-logout" onClick={signOut}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Menu;

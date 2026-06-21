'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("user");
    let user = null;

    try {
      user = rawUser ? JSON.parse(rawUser) : null;
    } catch {
      user = null;
    }

    const destination = user?.profile === "PROFESSOR" ? "/turmas" : "/cursos";
    router.replace(token ? destination : "/login");
  }, [router]);

  return <main />;
}

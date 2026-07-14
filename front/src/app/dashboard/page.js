"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Menu from "@/components/Menu";

const DashboardPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("token")) router.push("/login");
  }, []);

  return (
    <div className="page-wrapper">
      <Menu />
      <div className="page-content">
        <div className="dashboard-hero">
          <h1>Dashboard</h1>
          <p className="page-subtitle">Sistema de Gestão de Projetos Integradores</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

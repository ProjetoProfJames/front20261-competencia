'use client';

import { useEffect, useState } from 'react';
import '../../app/global.css'; // Ajuste o caminho se necessário

export default function PageLayout({ 
  title, 
  subtitle, 
  topRightAction, 
  bottomLeftAction, 
  children 
}) {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (typeof window !== "undefined") {
      const nomeSalvo = localStorage.getItem("userName");
      if (nomeSalvo) {
        setUserName(nomeSalvo);
      }
    }
  }, []);

  return (
    <div className="container-menu">
      
      {userName && (
        <div className="top-left-welcome">
          Olá, {userName}! 👋
        </div>
      )}

      {topRightAction && (
        <div className="top-right-actions">
          {topRightAction}
        </div>
      )}

      {bottomLeftAction && (
        <div className="bottom-left-actions">
          {bottomLeftAction}
        </div>
      )}

      <header className="header-menu">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </header>

      <main className="main-content" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        {children}
      </main>
    </div>
  );
}
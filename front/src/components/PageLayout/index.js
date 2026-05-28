'use client';

import '../../app/global.css';

export default function PageLayout({ 
  title, 
  subtitle, 
  topRightAction, 
  bottomLeftAction, 
  children 
}) {
  return (
    <div className="container-menu">
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

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
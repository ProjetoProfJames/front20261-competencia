'use client';

export default function RoleGuard({ allowedRoles, userRole, children }) {

  if (!allowedRoles.includes(userRole)) {
    return null; 
  }

  return <>{children}</>;
}
'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredToken, getStoredUser } from "@/lib/session";

export function useSession(requiredRoles = []) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const rolesKey = requiredRoles.join("|");

  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (!storedToken || !storedUser) {
      router.replace("/login");
      return;
    }

    setToken(storedToken);
    setUser(storedUser);

    if (requiredRoles.length > 0 && !requiredRoles.includes(storedUser.profile)) {
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [router, rolesKey]);

  const logout = () => {
    localStorage.removeItem("API-KEY");
    localStorage.removeItem("USER");
    router.replace("/login");
  };

  return {
    loading,
    token,
    user,
    logout,
    hasAccess:
      requiredRoles.length === 0 ||
      (user ? requiredRoles.includes(user.profile) : false),
  };
}

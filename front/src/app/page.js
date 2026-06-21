'use client'
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    if (localStorage.getItem('API-KEY')) {
      location.href = '/home';
    } else {
      location.href = '/login';
    }
  }, []);

  return (
    <>
      <div>Home</div>
    </>
  );
}

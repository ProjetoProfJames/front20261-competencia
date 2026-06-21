'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUsername, getProfile } from "@/utils/api";
import Button from "@/components/Button";
import { getNavigationItems } from "@/utils/navigation";

export default function Menu() {
  const router = useRouter();
  const [profile, setProfile] = useState('');
  const [username, setUsername] = useState('');
  useEffect(() => {
    const token = localStorage.getItem('JWT');
    if (!token) {
      router.push('/login');
      return;
    }
    setProfile(getProfile());
    setUsername(getUsername());
  }, [router]);

  const navigationItems = getNavigationItems(profile).filter((item) => item.href !== '/menu');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', 
      minHeight: '100vh',
      paddingTop: '50px',   
      gap: '40px'          
    }}>
      
     
      <h1 style={{ margin: 0 }}>Menu </h1>

      <h2>seja bem vindo, {username}!</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        width: '100%',
        maxWidth: '600px'
      }}>
        {navigationItems.map((item) => (
          <Button key={item.href} type="button" onClick={() => router.push(item.href)}>
            {item.label}
          </Button>
        ))}
      </div>

      <div style={{ marginTop: 'auto', marginBottom: '50px' }}>
      </div>
    </div>
  );
}

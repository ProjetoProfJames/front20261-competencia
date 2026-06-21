'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { logout, getUsername, getProfile } from '@/utils/api';

import Button from "@/components/Button";
import OptionLink from "@/components/OptionLink";
import { getNavigationItems } from '@/utils/navigation';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [username, setUsername] = useState('');
    const [profile, setProfile] = useState('');

    useEffect(() => {
        const user = getUsername();
        if (user) {
            setUsername(user);
        }

        const currentProfile = getProfile();
        if (currentProfile) {
            setProfile(currentProfile);
        }

        const token = localStorage.getItem('JWT');
        if (!token) {
            router.push('/login');
        }
    }, [pathname, router]);

    const navigationItems = getNavigationItems(profile);

    return (
        <header>
            <nav>
                {navigationItems.map((item) => (
                    <OptionLink key={item.href} href={item.href} label={item.label} />
                ))}
            </nav>

            <div>
                {username && <p>{username}</p>}

                <Button type="button" onClick={() => logout(router)}>Logout</Button>
            </div>
        </header>
    );
}
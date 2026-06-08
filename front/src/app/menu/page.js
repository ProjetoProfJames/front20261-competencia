'use client';

import { useRouter } from "next/navigation";
import { logout } from "@/utils/api";

import  Button  from "@/components/Button";
export default function Menu() {
  const router = useRouter();
  return (
    <>
    <div>Menu</div>
    <Button type="submit" onClick={() => logout(router)}>Logout</Button>
    </>
  );
}

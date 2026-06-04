'use client';
import { useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function LoginPage() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const authenticate = () => {
    setError("");
    
    if (user.email === "admin@unisales.br" && user.password === "admin@123") {
      const mockUser = {
        id: 1,
        username: "admin",
        email: "admin@unisales.br",
        profile: "ADMIN"
      };
      
      localStorage.setItem("token", "mock-jwt-token-12345");
      localStorage.setItem("userData", JSON.stringify(mockUser));
      
      window.location.href = "/";
    } else {
      setError("Usuário ou senha inválidos");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <FormInput label="Email" type="email" name="email" value={user.email} onChange={handleChange} />
      <FormInput label="Password" type="password" name="password" value={user.password} onChange={handleChange} />
      <Button type="button" onClick={authenticate}>Login</Button>
    </div>
  );
}
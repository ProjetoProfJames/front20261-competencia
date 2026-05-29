'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { api } from "@/services/api";

export default function CadastroPage() {
  const router = useRouter();
  
  const [user, setUser] = useState({ 
    username: "", 
    email: "", 
    password: "", 
    profile: "ADMIN" 
  });
  
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleRegister = async () => {
    setGeneralError("");
    setFieldErrors({});
    setIsLoading(true);

    if (!user.username.trim() || !user.email.trim() || !user.password.trim()) {
      setGeneralError("Por favor, preencha todos os campos obrigatórios.");
      setIsLoading(false);
      return;
    }

    try {
      await api.post("/users", user);

      alert("Usuário cadastrado com sucesso!");
      router.back();
    } catch (err) {
      console.log("Erro capturado no componente:", err);
      
      if (err.data) {
        setFieldErrors(err.data);
      }
      
      setGeneralError(err.message || "Erro ao tentar cadastrar usuário.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main">
      <section className="card">
        <header>
          <h1>Cadastre-se</h1>
        </header>

        {generalError && <p className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{generalError}</p>}

        <div className="form-group">
          <FormInput label="Nome de Usuário" type="text" name="username" value={user.username} onChange={handleChange} />
          {fieldErrors.username && <span className="text-danger" style={{ color: 'red', fontSize: '12px' }}>{fieldErrors.username}</span>}
        </div>

        <div className="form-group">
          <FormInput label="Email" type="email" name="email" value={user.email} onChange={handleChange} />
          {fieldErrors.email && <span className="text-danger" style={{ color: 'red', fontSize: '12px' }}>{fieldErrors.email}</span>}
        </div>

        <div className="form-group">
          <FormInput label="Senha" type="password" name="password" value={user.password} onChange={handleChange} />
          {fieldErrors.password && <span className="text-danger" style={{ color: 'red', fontSize: '12px' }}>{fieldErrors.password}</span>}
        </div>
        
        <div className="input-group" style={{ marginTop: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Perfil</label>
          <select name="profile" value={user.profile} onChange={handleChange} className="form-select">
            <option value="ALUNO">Aluno</option>
            <option value="PROFESSOR">Professor</option>
            <option value="COORDENADOR">Coordenador</option>
            <option value="AVALIADOR_EXTERNO">Avaliador Externo</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>
        
        <div className="actions" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <Button type="button" onClick={handleRegister}>
            {isLoading ? "Cadastrando..." : "Confirmar Cadastro"}
          </Button>
          <Button type="button" onClick={() => router.back()} className="btn-danger">Voltar</Button>
        </div>
      </section>
    </main>
  );
}
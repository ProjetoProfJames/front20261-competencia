'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { api } from "@/services/api";

export default function CadastroLocalPage() {
  const router = useRouter();

  const [local, setLocal] = useState({ 
    numero: "" 
  });
  
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocal((prevLocal) => ({ ...prevLocal, [name]: value }));
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleRegister = async () => {
    setGeneralError("");
    setFieldErrors({});
    setIsLoading(true);

    if (!local.numero.trim()) {
      setGeneralError("Por favor, preencha o número ou nome do local.");
      setIsLoading(false);
      return;
    }

    try {
      await api.post("/locais", local);

      alert("Local cadastrado com sucesso!");
      router.push("/locais");
    } catch (err) {
      console.log("Erro capturado no componente:", err);
      
      if (err.data) {
        setFieldErrors(err.data);
      }
      
      setGeneralError(err.message || "Erro ao tentar cadastrar local.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main">
      <section className="card">
        <header>
          <h1>Cadastrar Local</h1>
        </header>

        {generalError && <p className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{generalError}</p>}

        <div className="form-group">
          <FormInput 
            label="Número/Nome do Local (Ex: Sala 101)" 
            type="text" 
            name="numero" 
            value={local.numero} 
            onChange={handleChange} 
            maxLength={40}
          />
          {fieldErrors.numero && <span className="text-danger" style={{ color: 'red', fontSize: '12px' }}>{fieldErrors.numero}</span>}
        </div>

        <div className="actions" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <Button type="button" onClick={handleRegister}>
            {isLoading ? "Cadastrando..." : "Confirmar Cadastro"}
          </Button>
          <Button href="/locais">Voltar</Button>
        </div>
      </section>
    </main>
  );
}
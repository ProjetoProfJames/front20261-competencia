'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/framework/components/Button";
import FormInput from "@/app/framework/components/FormInput";
import { Get, Post } from "@/utils";
import Container from "../framework/components/Layouts/Container";
import Col from "../framework/components/Layouts/Col"
import { salvarToken } from "@/utils/api/Auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');


  const handleEmail = (email) => {
    setEmail(email.target.value)
  };

  const handleSenha = (senha) => {
    setSenha(senha.target.value)
  }

  const authenticate = async () => {
    try {
      const resposta = await Post('/api/auth/login', { email, 'password': senha })

      if (resposta.success && resposta.data.accessToken) {
        const token = resposta.data.accessToken;
        const profile = resposta.data.user?.profile;
        salvarToken(token, profile)
        window.location.href = '/menu'
      } else {
        alert('Resposta invalida do servidor')
      }
    } catch (error) {
      alert('E-mail ou senha incorretos')
    }
  };

  const loadBootstrap = async () => {
    try {
      await Post('/api/public/bootstrap', {})
      alert("Feito importação dos dados basicos")
    } catch (error) {
      alert("Algum erro ocorreu ao tentar importar: " + error)
    }
  }

  return (
    <div>
      <Container>
        <Col>
          <h1>Login</h1>

          <FormInput htmlFor={"email"} label={"Email"} type={"label"}></FormInput>
          <FormInput type={"input"} name={"email"} placeholder={"email@dominio.com"} value={email} onChange={handleEmail} />

          <FormInput htmlFor={"password"} label={"Senha"} type={"label"}></FormInput>
          <FormInput type={"input"} name={"password"} placeholder={"**********"} value={senha} onChange={handleSenha} />

          <Button type="submit" onClick={authenticate}>Login</Button>
          <Button onClick={() => console.log("Redirecionar para cadastro")}>Cadastrar</Button>
          <Button onClick={loadBootstrap}>Carregar Bootstrap</Button>
        </Col>
      </Container>
    </div>
  );
}

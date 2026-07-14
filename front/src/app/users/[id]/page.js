"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Menu from "@/components/Menu";
import { editUser, fetchUsers } from "@/services/usersApi";

const EditUserPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const [sessionUser, setSessionUser] = useState(null);
  const [emailReadOnly, setEmailReadOnly] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);

  const [fields, setFields] = useState({
    username: "",
    email: "",
    password: "",
    profile: "ALUNO",
  });

  const loadTargetUser = async () => {
    try {
      const { data } = await fetchUsers();
      const target = data.find((u) => u.id == id);
      if (!target) return;

      setEmailReadOnly(target.email);
      setFields({
        username: target.username,
        email: target.email,
        password: "",
        profile: target.profile,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return;

    const parsed = JSON.parse(raw);
    setSessionUser(parsed);

    if (parsed.profile === "ADMIN" || parsed.profile === "PROFESSOR") {
      loadTargetUser();
    } else {
      setEmailReadOnly(parsed.email);
      setFields({
        username: parsed.username,
        email: parsed.email,
        password: "",
        profile: parsed.profile,
      });
    }
  }, []);

  const onFieldChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = async () => {
    try {
      const isAdmin = sessionUser?.profile === "ADMIN";

      if (fields.password && fields.password.length < 6) {
        alert("A senha deve ter no mínimo 6 caracteres.");
        return;
      }

      if (fields.password && fields.password.length > 120) {
        alert("A senha deve ter no máximo 120 caracteres.");
        return;
      }

      const payload = isAdmin
        ? {
            username: fields.username,
            password: fields.password || undefined,
            profile: fields.profile,
          }
        : {
            password: fields.password,
          };

      await editUser(id, payload);
      alert("Usuário atualizado");
      router.push("/users");
    } catch (err) {
      console.error(err);
    }
  };

  const isAdmin = sessionUser?.profile === "ADMIN";

  return (
    <div className="page-wrapper">
      <Menu />
      <div className="page-content">
        <div className="form-card">
          <h1>Editar Usuário</h1>

          {isAdmin ? (
            <>
              <div className="form-group">
                <label>Nome</label>
                <input
                  placeholder="Nome"
                  name="username"
                  value={fields.username}
                  onChange={onFieldChange}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  placeholder="Email"
                  name="email"
                  value={fields.email}
                  onChange={onFieldChange}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>
                  Nova Senha <span className="field-hint">(mínimo 6 caracteres)</span>
                </label>
                <input
                  placeholder="Nova Senha"
                  type={revealPassword ? "text" : "password"}
                  name="password"
                  value={fields.password}
                  onChange={onFieldChange}
                />
                <label className="login-checkbox tight">
                  <input
                    type="checkbox"
                    checked={revealPassword}
                    onChange={() => setRevealPassword(!revealPassword)}
                  />
                  Mostrar senha
                </label>
              </div>

              <div className="form-group">
                <label>Perfil</label>
                <select name="profile" value={fields.profile} onChange={onFieldChange}>
                  <option value="ADMIN">ADMIN</option>
                  <option value="COORDENADOR">COORDENADOR</option>
                  <option value="PROFESSOR">PROFESSOR</option>
                  <option value="ALUNO">ALUNO</option>
                  <option value="AVALIADOR_EXTERNO">AVALIADOR_EXTERNO</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="email-display">Email: {emailReadOnly}</div>

              <div className="form-group">
                <label>
                  Nova Senha <span className="field-hint">(mínimo 6 caracteres)</span>
                </label>
                <input
                  placeholder="Nova Senha"
                  type={revealPassword ? "text" : "password"}
                  name="password"
                  value={fields.password}
                  onChange={onFieldChange}
                />
                <label className="login-checkbox tight">
                  <input
                    type="checkbox"
                    checked={revealPassword}
                    onChange={() => setRevealPassword(!revealPassword)}
                  />
                  Mostrar senha
                </label>
              </div>
            </>
          )}

          <div className="form-actions">
            <button className="btn btn-primary" onClick={onSave}>
              Salvar
            </button>
            <button className="btn btn-outline" onClick={() => router.push("/users")}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserPage;

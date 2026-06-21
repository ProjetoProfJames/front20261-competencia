'use client';
import { useState, useEffect } from 'react';
import RotaProtegida from '@/app/framework/components/RotaProtegida';
import Container from '@/app/framework/components/Layouts/Container';
import Row from '@/app/framework/components/Layouts/Row';
import Col from '@/app/framework/components/Layouts/Col';
import Table from '@/app/framework/components/Table';
import Modal from '@/app/framework/components/Modal';
import Button from '@/app/framework/components/Button';
import FormInput from '@/app/framework/components/FormInput';
import Get from '@/utils/api/Get';
import Post from '@/utils/api/Post';
import Put from '@/utils/api/Put';
import Delete from '@/utils/api/Delete';
import { obterToken } from '@/utils/api/Auth';

const PROFILES = ['ADMIN', 'COORDENADOR', 'PROFESSOR', 'ALUNO', 'AVALIADOR_EXTERNO'];

export default function Users() {
  const [usuarios, setUsuarios] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [editando, setEditando] = useState(null);
  const [excluindo, setExcluindo] = useState(null);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState('ALUNO');

  const [erro, setErro] = useState('');

  const headers = {
    headers: { Authorization: `Bearer ${obterToken()}` },
  };

  async function carregarUsuarios() {
    try {
      const res = await Get('/api/users', headers);
      setUsuarios(res.data || []);
    } catch (e) {
      console.log('Erro ao carregar usuários', e);
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  function abrirModalCriar() {
    setEditando(null);
    setUsername('');
    setEmail('');
    setPassword('');
    setProfile('ALUNO');
    setErro('');
    setModalAberto(true);
  }

  function abrirModalEditar(user) {
    setEditando(user);
    setUsername(user.username || '');
    setEmail(user.email || '');
    setPassword('');
    setProfile(user.profile || 'ALUNO');
    setErro('');
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setEditando(null);
    setErro('');
  }

  function abrirModalExcluir(user) {
    setExcluindo(user);
    setModalExcluir(true);
  }

  function fecharModalExcluir() {
    setModalExcluir(false);
    setExcluindo(null);
  }

  async function salvarUsuario() {
    setErro('');

    if (!username.trim()) {
      setErro('O nome de usuário é obrigatório.');
      return;
    }

    try {
      if (editando) {
        const dados = { username, profile };
        if (password.trim()) {
          dados.password = password;
        }
        await Put(`/api/users/${editando.id}`, dados, headers);
      } else {
        if (!email.trim()) {
          setErro('O e-mail é obrigatório.');
          return;
        }
        if (!password.trim() || password.length < 6) {
          setErro('A senha deve ter pelo menos 6 caracteres.');
          return;
        }
        await Post('/api/users', { username, email, password, profile }, headers);
      }
      fecharModal();
      carregarUsuarios();
    } catch (e) {
      setErro('Erro ao salvar usuário. Verifique os dados e tente novamente.');
      console.log('Erro ao salvar', e);
    }
  }

  async function confirmarExclusao() {
    try {
      await Delete(`/api/users/${excluindo.id}`, headers);
      fecharModalExcluir();
      carregarUsuarios();
    } catch (e) {
      console.log('Erro ao excluir', e);
    }
  }

  const colunas = [
    { label: 'ID', key: 'id' },
    { label: 'Nome', key: 'username' },
    { label: 'E-mail', key: 'email' },
    { label: 'Perfil', key: 'profile' },
    {
      label: 'Ações',
      key: 'acoes',
    },
  ];

  const dadosTabela = usuarios.map((u) => ({
    ...u,
    acoes: (
      <Row align="center" justify="evenly">
        <Button type="laranja" onClick={() => abrirModalEditar(u)}>Editar</Button>
        <Button type="vermelho" onClick={() => abrirModalExcluir(u)}>Excluir</Button>
      </Row>
    ),
  }));

  return (
    <RotaProtegida roles={['ADMIN']}>
      <Container>
        <Row align="center" justify="between">
          <Col>
            <h2 style={{ margin: 'var(--margin-md) 0' }}>Gerenciamento de Usuários</h2>
          </Col>
          <Col>
            <Row align="center" justify="end">
              <Button type="azul" onClick={abrirModalCriar}>+ Novo Usuário</Button>
            </Row>
          </Col>
        </Row>

        <Table columns={colunas} data={dadosTabela} />

        {modalAberto && (
          <Modal title={editando ? 'Editar Usuário' : 'Novo Usuário'}>
            <h3 style={{ marginBottom: 'var(--margin-md)' }}>
              {editando ? 'Editar Usuário' : 'Novo Usuário'}
            </h3>

            <FormInput
              type="form-group"
              label="Nome de Usuário"
              name="username"
              placeholder="Digite o nome"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            {!editando && (
              <FormInput
                type="form-group"
                label="E-mail"
                name="email"
                placeholder="Digite o e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}

            <FormInput
              type="form-group"
              label={editando ? 'Nova Senha (deixe vazio para manter)' : 'Senha'}
              name="password"
              placeholder="Digite a senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
              <label style={{ fontFamily: 'sans-serif', fontSize: '14px', fontWeight: 500 }}>Perfil</label>
              <select
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md)',
                  fontSize: '14px',
                  border: '1px solid #cccccc',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              >
                {PROFILES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {erro && (
              <p style={{ color: 'var(--error)', fontSize: '14px', marginBottom: 'var(--spacing-md)' }}>
                {erro}
              </p>
            )}

            <Row align="center" justify="evenly">
              <Button type="azul" onClick={salvarUsuario}>Salvar</Button>
              <Button type="vermelho" onClick={fecharModal}>Cancelar</Button>
            </Row>
          </Modal>
        )}

        {modalExcluir && excluindo && (
          <Modal title="Confirmar Exclusão">
            <h3 style={{ marginBottom: 'var(--margin-md)' }}>Confirmar Exclusão</h3>
            <p style={{ marginBottom: 'var(--margin-lg)', fontFamily: 'sans-serif' }}>
              Tem certeza que deseja excluir o usuário <strong>{excluindo.username}</strong>?
            </p>
            <Row align="center" justify="evenly">
              <Button type="vermelho" onClick={confirmarExclusao}>Confirmar</Button>
              <Button type="azul" onClick={fecharModalExcluir}>Cancelar</Button>
            </Row>
          </Modal>
        )}
      </Container>
    </RotaProtegida>
  );
}

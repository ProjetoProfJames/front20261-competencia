'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

import Menu from '@/components/Menu';

import { getLocal, updateLocal } from '@/services/localService';

export default function EditLocalPage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    numero: '',
  });

  async function loadLocal() {
    try {
      const response = await getLocal(id);
      setForm({ numero: response.data.numero });
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar local ');
    }
  }

  function handleChange(e) {
    const { name, value } = e.target; 

    setForm({
      ...form,
      [name]: value,
    });
  }

  async function handleSubmit() {
    if (!form.numero.trim()) {
      alert('Informe o nome do local.');
      return;
    }

    try {
      await updateLocal(id, form);
      router.push('/locais');
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar local.');
    }
  }

  useEffect(() => {
    loadLocal();
  }, []);

  return (
    <div>
      <Menu />

      <h1>Editar Local</h1>

      <input
        placeholder='Nome do local'
        name='numero' 
        value={form.numero}
        onChange={handleChange}
      />

      <button onClick={handleSubmit}>
        Salvar
      </button>

      <button onClick={() => router.push('/locais')}>
        Cancelar
      </button>
    </div>
  );
}
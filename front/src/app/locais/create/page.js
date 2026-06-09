'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Menu from '@/components/Menu';
import { createLocal } from '@/services/localService';

export default function CreateLocalPage() {
  const router = useRouter();
  const [form, setForm] = useState({ numero: '' });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit() {
    if (!form.numero.trim()) { alert('Informe o nome do local.'); return; }
    try {
      await createLocal(form);
      router.push('/locais');
    } catch (error) {
      console.error(error);
      alert('Erro ao criar local.');
    }
  }

  return (
    <div className='page-wrapper'>
      <Menu />
      <div className='page-content'>
        <div className='form-card'>
          <h1>Novo Local</h1>
          <div className='form-group'>
            <label>Nome do local</label>
            <input placeholder='Nome do local' name='numero' value={form.numero} onChange={handleChange} />
          </div>
          <div className='form-actions'>
            <button className='btn btn-primary' onClick={handleSubmit}>Salvar</button>
            <button className='btn btn-outline' onClick={() => router.push('/locais')}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
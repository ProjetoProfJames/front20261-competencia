# Guia de Cores e Componentes - PIE Manager

## 🎨 Paleta de Cores

### Cores Principais
```css
--primary: #6366f1          /* Índigo - Botões, Links */
--primary-dark: #4f46e5     /* Índigo Escuro - Hover, Headers */
--secondary: #f97316        /* Laranja - Destaque */
--success: #22c55e          /* Verde - Sucesso, Confirmação */
--danger: #ef4444           /* Vermelho - Erro, Exclusão */
--warning: #eab308          /* Amarelo - Avisos */
```

### Escala de Cinzas
```css
--gray-50: #f9fafb      /* Fundo muito claro */
--gray-100: #f3f4f6     /* Fundo claro */
--gray-200: #e5e7eb     /* Bordas, Divisores */
--gray-300: #d1d5db     /* Inputs desabilitados */
--gray-600: #4b5563     /* Texto secundário */
--gray-700: #374151     /* Texto comum */
--gray-800: #1f2937     /* Texto forte */
--gray-900: #111827     /* Preto - Texto principal */
```

## 📦 Componentes Reutilizáveis

### Button
```jsx
// Variações
<button className="btn btn-primary">Primário</button>
<button className="btn btn-secondary">Secundário</button>
<button className="btn btn-danger">Perigo</button>
<button className="btn btn-success">Sucesso</button>

// Com atributos
<button className="btn btn-primary" disabled>Desabilitado</button>
```

### Alert
```jsx
// Variações
<div className="alert alert-error">Mensagem de erro</div>
<div className="alert alert-success">Sucesso!</div>
<div className="alert alert-info">Informação</div>
```

### Tabelas
```jsx
<table>
  <thead>
    <tr>
      <th>Coluna 1</th>
      <th>Coluna 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Dado 1</td>
      <td>Dado 2</td>
    </tr>
  </tbody>
</table>
```

### Formulários
```jsx
<form className="form-container">
  <div className="form-group">
    <label>Email</label>
    <input type="email" />
  </div>
  
  <div className="form-group">
    <label>Perfil</label>
    <select>
      <option>ADMIN</option>
      <option>PROFESSOR</option>
    </select>
  </div>
  
  <div className="btn-group">
    <button className="btn btn-primary">Salvar</button>
    <button className="btn btn-secondary">Cancelar</button>
  </div>
</form>
```

## 🎯 Tokens e Responsividade

### Sombras
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)      /* Leve */
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)       /* Média */
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)     /* Grande */
```

### Espaçamento
- Padding/Margin base: 8px
- Multiplicadores: 12px, 16px, 24px, 32px

### Border Radius
```css
--border-radius: 8px
```

### Breakpoints
- Desktop: 1200px
- Tablet: 768px
- Mobile: <768px

## 📱 Adaptações Mobile

O CSS já inclui media query para mobile:
```css
@media (max-width: 768px) {
  /* Grid de 2 colunas vira 1 */
  .grid-cols-2 { grid-template-columns: 1fr; }
  
  /* Navegação se adapta */
  nav { gap: 16px; }
  
  /* User info reorganiza */
  .user-info { flex-direction: column; }
}
```

## 🔄 Estados de Interação

### Hover
```css
button:hover {
  background-color: darker;
  box-shadow: var(--shadow-md);
}

nav a:hover {
  color: var(--primary);
  border-bottom-color: var(--primary);
}
```

### Focus
```css
input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
```

### Disabled
```css
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## 💡 Customização

Para customizar o design globalmente, edite apenas `/app/global.css`:

1. **Mudar cor primária**: Altere `--primary: #6366f1` para outra cor
2. **Mudar fonte**: Ajuste `font-family` no `body`
3. **Mudar espaçamento**: Modifique os valores de padding/margin
4. **Adicionar novo tema**: Crie novas variáveis CSS

Exemplo - Tema Verde:
```css
:root {
  --primary: #16a34a;
  --primary-dark: #15803d;
  --success: #22c55e;
}
```

## 📐 Grid Layout

```jsx
<div className="grid grid-cols-2">
  <div>Coluna 1</div>
  <div>Coluna 2</div>
</div>
```

No mobile (< 768px) vira uma coluna:
```
[Coluna 1]
[Coluna 2]
```

## 🎭 Classes Úteis

- `.container` - Max-width 1200px, centralizado
- `.form-container` - Formulário com background branco
- `.pagina-cabecalho` - Header com título e botões
- `.alert` - Container para mensagens
- `.btn-group` - Grupo de botões alinhados

## 📌 Exemplo Completo

```jsx
export default function Page() {
  return (
    <LayoutComponent>
      <div className="pagina-cabecalho">
        <h1>Minha Página</h1>
        <button className="btn btn-primary">Ação</button>
      </div>

      <div className="grid grid-cols-2">
        <div style={{ padding: '24px', background: 'white', borderRadius: 'var(--border-radius)' }}>
          Card 1
        </div>
        <div style={{ padding: '24px', background: 'white', borderRadius: 'var(--border-radius)' }}>
          Card 2
        </div>
      </div>
    </LayoutComponent>
  )
}
```

---

**Nota**: Este design foi pensado para ser simples, profissional e fácil de entender. Use as variáveis CSS para manter consistência em todo o projeto.

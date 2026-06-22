# Documentacao da estilização da Task 1

## Visao geral da estilização

A interface foi estilizada com CSS puro no arquivo `src/app/global.css`.

O objetivo foi criar um visual de wireframe funcional: fundo cinza claro, blocos brancos, bordas finas e divisões simples. A estrutura usa Flexbox e Grid apenas para organizar os elementos na tela.

O menu lateral fica fixo à esquerda usando `position: fixed`. A barra superior tambem fica fixa no topo da area principal. O conteudo das paginas usa `.page-content`, que cria o espacamento necessario para nao ficar embaixo da sidebar nem da topbar.

As telas de listagem usam um painel branco com tabela simples. As telas de formulario usam campos empilhados verticalmente. A home usa cards em grid para representar os modulos da Task 1.

Nenhuma biblioteca externa de CSS foi usada.

## Principais classes

### `.sidebar`

Forma o menu lateral esquerdo. Possui fundo cinza claro, altura total da tela e borda fina do lado direito.

### `.menu-link`

Estiliza cada link do menu como um bloco retangular simples, com fundo branco e borda fina.

### `.topbar`

Forma a barra superior da area principal. Fica no topo direito, mostra a saudacao do usuario e o botao de sair.

### `.page-content`

Define o espaco principal das paginas internas. Usa margem esquerda para respeitar a sidebar e padding superior para respeitar a topbar.

### `.content-panel`

Cria o bloco branco principal de cada tela. Tem borda fina e padding interno.

### `.cards-grid`

Organiza os cards da home em colunas usando CSS Grid.

### `.card-modulo`

Representa cada modulo da home como um bloco branco/cinza, com borda fina e texto centralizado.

### `.tabela-simples`

Estiliza as tabelas dos CRUDs com bordas simples, linhas separadas e cabecalho em cinza claro.

### `.form-grid`

Organiza os formularios em coluna, com espacamento entre os campos.

### `.form-campo`

Estiliza o bloco de cada input, deixando label e campo empilhados.

### `.button-simples`

Estiliza todos os botoes com borda fina, fundo branco e aparencia simples.

### `.mensagem`

Cria um bloco simples para mensagens de erro, sucesso ou carregamento.

## Responsividade basica

Existe uma regra `@media (max-width: 760px)` para telas menores.

Nessa largura:

- A sidebar deixa de ser fixa e passa a ocupar o topo.
- A topbar tambem deixa de ser fixa.
- O conteudo remove a margem esquerda.
- Os cards ficam em uma coluna.
- Os botoes de acao da tabela ficam empilhados.

## Guia de apresentacao

Durante a apresentacao, explique que a estilização foi feita para parecer um wireframe limpo e funcional. A ideia foi separar visualmente cada area do sistema usando blocos brancos, fundo cinza claro e bordas finas.

Explique que a tela foi dividida em três partes principais:

1. Sidebar para navegacao.
2. Topbar com saudacao e logout.
3. Area de conteudo com paineis, tabelas e formularios.

Explique tambem que nenhum framework visual foi usado. Todo o layout foi feito com CSS puro, usando apenas Flexbox, Grid, bordas, espaçamentos e cores neutras.

## Checklist final

[x] A estrutura e a logica React foram mantidas sem refatoracao funcional

[x] O layout segue a tabela especificada com sidebar esquerda, topbar superior e conteudo em blocos

[x] As listagens usam tabelas simples com bordas finas

[x] Os formularios usam campos organizados em blocos

[x] Nenhuma biblioteca externa foi usada

[x] Nenhum comentario foi deixado no codigo

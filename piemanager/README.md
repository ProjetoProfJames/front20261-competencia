# PIE Manager API

API REST desenvolvida com Spring Boot para gerenciamento de usuarios, seguindo o padrao MVC, com autenticacao JWT, persistencia em SQLite, documentacao Swagger e resposta padronizada.

## Padroes estabelecidos no projeto

### Arquitetura
- REST para exposicao da API.
- MVC para organizacao das camadas.
- DTOs para trafego de dados entre controller e service.
- Service layer para regras de negocio.
- Repository layer com Spring Data JPA.
- Tratamento global de excecoes com resposta consistente.
- CORS configurado para permitir acesso de qualquer dominio.
- Documentacao da API com Swagger/OpenAPI.
- Autenticacao e autorizacao com Spring Security e JWT.
- Banco de dados local com SQLite.

## Como executar

### Pre-requisitos
- Java 17 instalado
- Permissao para executar o Maven Wrapper do projeto

### Rodar a aplicacao
No Windows:

```powershell
./mvnw.cmd spring-boot:run
```

No Linux/macOS:

```bash
./mvnw spring-boot:run
```

A API iniciara, por padrao, na porta `8080`.



## 3. Acessar Swagger
Abra no navegador:

- `http://localhost:8080/swagger-ui.html`
- `http://localhost:8080/v3/api-docs`

## Padrao de dominio
- O package base do projeto e `com.unisales.piemanager`.
- A pasta deve ser organizada conforme o padrao MVC e deve seguir a seguinte estrutura:
```
User/ (domain)
    User.java (Model)
    UserController.java (Controller)
    UserService.java (Service)
    UserRepository.java (Repository)
    dto/ (DTOs)
```
### 1. Criar o usuario admin inicial

```bash
curl -X POST http://localhost:8080/api/public/bootstrap
```

## Tecnologias utilizadas
- Java 17
- Spring Boot 4.0.6
- Spring Web MVC
- Spring Data JPA
- Spring Security
- JWT com JJWT
- Bean Validation
- Springdoc OpenAPI / Swagger UI
- SQLite JDBC
- Hibernate Community Dialects
- Maven Wrapper

## Configuracao da aplicacao

As configuracoes principais estao em [src/main/resources/application.properties](src/main/resources/application.properties):

- Banco SQLite: `jdbc:sqlite:piemanager.db`
- Hibernate DDL: `update`
- Swagger UI: `/swagger-ui.html`
- JWT expiration: `3600000` ms

## Observacoes
- O arquivo do banco SQLite sera criado ou atualizado na raiz do projeto como `piemanager.db`.
- O package valido utilizado no codigo e `com.unisales.piemanager`.
- O arquivo [HELP.md](HELP.md) contem as anotacoes geradas inicialmente pelo Spring Boot, mas o guia principal do projeto passa a ser este `README.md`.

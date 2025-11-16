# 🎓 Sistema de Gestão de Vagas e Estágios

Plataforma web completa para gerenciamento de vagas de emprego e estágios, conectando estudantes a oportunidades profissionais de forma eficiente e organizada.

## 📋 Sobre o Projeto

O Sistema de Gestão de Vagas e Estágios é uma aplicação full-stack desenvolvida para facilitar o processo de conexão entre empresas que oferecem oportunidades e estudantes em busca de estágios e empregos. A plataforma oferece ferramentas completas de gerenciamento de dados, visualização analítica e cadastro de candidatos.

### 🏗️ Arquitetura

O projeto utiliza uma arquitetura cliente-servidor com:
- **Backend:** API RESTful em Java Spring Boot com JPA/Hibernate para persistência
- **Frontend:** SPA (Single Page Application) em React com Vite
- **Banco de Dados:** Sistema relacional com entidades bem estruturadas

## ✨ Funcionalidades

### 🗄️ Gerenciamento de Banco de Dados
- **Consultas personalizadas** ao banco de dados
- **Inserção** de novos registros
- **Atualização** de informações existentes
- **Exclusão** de dados obsoletos
- Interface intuitiva para operações CRUD

### 📊 Dashboard Interativo
- Gráficos dinâmicos com dados em tempo real
- Visualização de estatísticas de vagas
- Métricas de candidatos cadastrados
- Análise de tendências do mercado

### 👥 Gestão de Estudantes
- Lista completa de estudantes cadastrados
- Formulário de cadastro integrado
- Perfis detalhados dos candidatos
- Filtros e busca avançada

### 💼 Visualização de Vagas
- Listagem de todas as vagas disponíveis

## 🚀 Tecnologias Utilizadas

- **Frontend:** React.js
- **Backend:** Java Spring Boot
- **Banco de Dados:** MySQL / PostgreSQL
- **Visualização de Dados:** Biblioteca de gráficos (Chart.js/Recharts)
- **Build Tool:** Vite
- **Gerenciamento de Dependências:** Maven (mvnw)

## 📦 Instalação

### Pré-requisitos

```bash
Node.js (versão 16.x ou superior)
Java JDK 17 ou superior
MySQL/PostgreSQL
Maven (incluído via mvnw)
npm ou yarn
```

### Passos de Instalação

#### Backend (Java Spring Boot)

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/nome-do-projeto.git
cd nome-do-projeto
```

2. Configure o banco de dados
- Edite o arquivo `src/main/resources/application.properties`
- Configure as credenciais do banco de dados

3. Execute o backend
```bash
# No diretório raiz do projeto
./mvnw spring-boot:run
# ou no Windows
mvnw.cmd spring-boot:run
```

#### Frontend (React)

1. Acesse o diretório do frontend
```bash
cd front
```

2. Instale as dependências
```bash
npm install
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

4. Acesse a aplicação em `http://localhost:5173`

## 🎯 Como Usar

### Para Administradores

1. **Acesse o painel de gerenciamento** para realizar operações no banco de dados
2. **Visualize o dashboard** para análise de métricas e estatísticas
3. **Gerencie vagas** adicionando, editando ou removendo oportunidades
4. **Acompanhe candidatos** através da lista de estudantes

### Para Estudantes

1. **Preencha o formulário de cadastro** com suas informações
2. **Navegue pelas vagas disponíveis** e encontre oportunidades compatíveis
3. **Atualize seu perfil** conforme necessário

## 📸 Screenshots

[Adicione capturas de tela do seu projeto aqui]

## 🗂️ Estrutura do Projeto

```
projeto/
├── front/                    # Frontend React
│   ├── public/              # Arquivos públicos
│   └── src/
│       ├── assets/          # Imagens e recursos estáticos
│       ├── components/      # Componentes React
│       │   ├── Header.jsx
│       │   ├── Footer.jsx
│       │   └── Visualizar.jsx
│       ├── css/            # Estilos CSS
│       └── pages/          # Páginas da aplicação
│           ├── Dashboard.jsx
│           ├── JBDC.jsx
│           ├── Sql.jsx
│           └── Vagas.jsx
├── src/                     # Backend Java Spring Boot
│   ├── main/
│   │   ├── java/br/com/oportunitech/
│   │   │   ├── config/           # Configurações (CORS, etc)
│   │   │   ├── controllers/      # Controllers REST
│   │   │   │   ├── SqlController.java
│   │   │   │   └── VagasController.java
│   │   │   ├── entities/         # Entidades JPA
│   │   │   │   ├── Curso.java
│   │   │   │   ├── Departamento.java
│   │   │   │   ├── Empresa.java
│   │   │   │   ├── Endereco.java
│   │   │   │   ├── Entrevista.java
│   │   │   │   ├── Estudante.java
│   │   │   │   ├── Funcionario.java
│   │   │   │   └── Vaga.java
│   │   │   ├── repository/       # Repositories JPA
│   │   │   │   └── VagasRepository.java
│   │   │   └── service/          # Camada de serviços
│   │   │       └── VagaService.java
│   │   └── resources/
│   │       └── application.properties  # Configurações do Spring
│   └── test/                # Testes unitários
├── target/                  # Build do Maven
├── .gitignore
├── .gitattributes
├── Dockerfile              # Containerização
├── mvnw                    # Maven wrapper (Linux/Mac)
├── mvnw.cmd               # Maven wrapper (Windows)
├── pom.xml                # Dependências Maven
└── README.md
```

## 📄 Licença

Este projeto está sob a licença [MIT/Apache/GPL - escolha uma]. Veja o arquivo `LICENSE` para mais detalhes.

**Desenvolvido com ❤️ para conectar estudantes a oportunidades**

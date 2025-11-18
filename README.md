# 🎓 Sistema de Gestão de Vagas e Estágios

> Projeto acadêmico desenvolvido para a disciplina de Banco de Dados

Plataforma web completa para gerenciamento de vagas de emprego e estágios, conectando estudantes a oportunidades profissionais de forma eficiente e organizada.

## 📋 Sobre o Projeto

O Sistema de Gestão de Vagas e Estágios é um projeto acadêmico desenvolvido para a disciplina de Banco de Dados, com o objetivo de aplicar conceitos de modelagem, implementação e manipulação de bancos de dados relacionais em um cenário prático.

O sistema facilita o processo de conexão entre empresas que oferecem oportunidades e estudantes em busca de estágios e empregos, oferecendo ferramentas completas de gerenciamento de dados, visualização analítica e cadastro de candidatos.

### 🎯 Objetivos Acadêmicos

- Aplicar conceitos de **modelagem de banco de dados** (normalização, relacionamentos, integridade referencial)
- Implementar operações **CRUD completas** (Create, Read, Update, Delete)
- Desenvolver **consultas SQL complexas** com joins, agregações e subconsultas
- Criar **visualizações gráficas** de dados armazenados
- Integrar banco de dados com aplicação **full-stack**

### 🏗️ Arquitetura

O projeto utiliza uma arquitetura cliente-servidor com:
- **Backend:** API RESTful em Java Spring Boot com JPA/Hibernate para persistência
- **Frontend:** SPA (Single Page Application) em React com Vite
- **Banco de Dados:** Sistema relacional com entidades bem estruturadas e relacionamentos complexos

## ✨ Funcionalidades

### 🗄️ Gerenciamento de Banco de Dados
- **Consultas SQL personalizadas** com interface interativa
- **Inserção de dados** através de formulários validados
- **Atualização** de registros existentes
- **Exclusão** com confirmação para evitar perda de dados
- Demonstração prática de **operações CRUD**

### 📊 Dashboard Interativo
- Gráficos dinâmicos com dados em tempo real do banco
- Estatísticas de vagas cadastradas por empresa/departamento
- Métricas de estudantes e cursos
- Análise de entrevistas realizadas
- Visualização de tendências e distribuições

### 👥 Gestão de Estudantes
- Lista completa de estudantes cadastrados via formulário
- Perfis detalhados com informações acadêmicas
- Relacionamento com cursos e departamentos
- Histórico de entrevistas e candidaturas

### 💼 Visualização de Vagas
- Listagem de todas as vagas disponíveis

### 🔍 Consultas SQL Diretas
- Interface para execução de queries SQL customizadas
- Visualização de resultados em tabelas formatadas
- Ferramenta educacional para aprendizado de SQL

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
│           ├── Dashboard.jsx    # Gráficos e estatísticas
│           ├── JBDC.jsx        # Interface JDBC
│           ├── Sql.jsx         # Executor de queries SQL
│           └── Vagas.jsx       # Listagem de vagas
├── src/                     # Backend Java Spring Boot
│   ├── main/
│   │   ├── java/br/com/oportunitech/
│   │   │   ├── config/           # Configurações (CORS, etc)
│   │   │   ├── controllers/      # Controllers REST
│   │   │   │   ├── SqlController.java
│   │   │   │   └── VagasController.java
│   │   │   ├── entities/         # Entidades JPA (Modelo de Dados)
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

## 💾 Modelo de Dados

O banco de dados conta com as seguintes entidades principais:

- **Estudante**: Informações dos candidatos a vagas
- **Curso**: Cursos acadêmicos dos estudantes
- **Departamento**: Departamentos organizacionais
- **Empresa**: Empresas que oferecem vagas
- **Vaga**: Oportunidades de emprego/estágio
- **Entrevista**: Processos seletivos agendados
- **Funcionario**: Colaboradores das empresas
- **Endereco**: Localização geográfica

*Relacionamentos entre as entidades demonstram conceitos de cardinalidade (1:N, N:M) e integridade referencial.*

## 📄 Licença

Este projeto está sob a licença MIT.

⭐ Projeto desenvolvido como atividade acadêmica - Disciplina de Banco de Dados

Grupo:
- Caio Ferreira
- Davi Marques
- Luiz Claudio
- Henrique Brito

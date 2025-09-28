# API Oportunitech - Documentação

## Configuração do Banco de Dados

O projeto está configurado para usar **MySQL** com JDBC explícito. Todas as consultas SQL são escritas manualmente usando `JdbcTemplate`.

## Endpoints Implementados

### 🎯 CRUD - Vagas (Tabela 1)
**Base URL:** `/api/vagas`

- **POST** `/api/vagas` - Criar nova vaga
- **GET** `/api/vagas` - Listar todas as vagas
- **GET** `/api/vagas/{id}` - Buscar vaga por ID
- **PUT** `/api/vagas/{id}` - Atualizar vaga
- **DELETE** `/api/vagas/{id}` - Deletar vaga

#### Estrutura Vaga:
```json
{
  "cod_vaga": "uuid",
  "titulo": "string",
  "descricao": "string",
  "carga_horaria": "number",
  "modalidades": "REMOTO|PRESENCIAL|HIBRIDO"
}
```

### 👨‍🎓 CRUD - Estudantes (Tabela 2)
**Base URL:** `/api/estudantes`

- **POST** `/api/estudantes` - Criar novo estudante
- **GET** `/api/estudantes` - Listar todos os estudantes
- **GET** `/api/estudantes/{id}` - Buscar estudante por ID
- **GET** `/api/estudantes/email/{email}` - Buscar estudante por email
- **PUT** `/api/estudantes/{id}` - Atualizar estudante
- **DELETE** `/api/estudantes/{id}` - Deletar estudante

#### Estrutura Estudante:
```json
{
  "id": "uuid",
  "email": "string",
  "primeiroNome": "string",
  "segundoNome": "string",
  "telefone": "string"
}
```

### 📊 Consultas Complexas (4+ consultas com JOIN)
**Base URL:** `/api/consultas`

1. **GET** `/api/consultas/vagas-com-empresa` - Vagas com informações da empresa (JOIN)
2. **GET** `/api/consultas/estatisticas-vagas-empresa` - Estatísticas por empresa (JOIN + GROUP BY)
3. **GET** `/api/consultas/estudantes-com-entrevistas` - Estudantes e suas entrevistas (JOIN)
4. **GET** `/api/consultas/relatorio-completo` - Relatório com múltiplos JOINs
5. **GET** `/api/consultas/metricas-gerais` - Métricas do dashboard
6. **GET** `/api/consultas/vagas-modalidade-mensal` - Evolução temporal das vagas
7. **POST** `/api/consultas/personalizada` - Executar SQL personalizado (apenas SELECT)

#### SQL Personalizado:
```json
{
  "sql": "SELECT * FROM tb_vaga WHERE modalidades = 'REMOTO'"
}
```

### 📈 Dashboard e Gráficos (Para Estatística)
**Base URL:** `/api/dashboard`

- **GET** `/api/dashboard/metricas` - Métricas gerais
- **GET** `/api/dashboard/grafico/vagas-modalidade` - Gráfico pizza: vagas por modalidade
- **GET** `/api/dashboard/grafico/vagas-carga-horaria` - Gráfico barras: vagas por carga horária
- **GET** `/api/dashboard/grafico/estudantes-dominio` - Gráfico barras: estudantes por domínio
- **GET** `/api/dashboard/grafico/estudantes-nomes` - Gráfico donut: completude de nomes
- **GET** `/api/dashboard/grafico/vagas-tempo` - Gráfico linha: evolução temporal
- **GET** `/api/dashboard/tabela/relatorio-completo` - Tabela completa
- **GET** `/api/dashboard/tabela/vagas-empresa` - Tabela vagas por empresa
- **GET** `/api/dashboard/completo` - Dashboard completo com todos os dados

### 📊 Consultas Específicas para Gráficos

#### Vagas:
- **GET** `/api/vagas/estatisticas/modalidade` - Contagem por modalidade
- **GET** `/api/vagas/carga-horaria-acima-media` - Vagas acima da média de carga horária
- **GET** `/api/vagas/estatisticas/carga-horaria` - Distribuição por faixa horária

#### Estudantes:
- **GET** `/api/estudantes/dominio?dominio=gmail.com` - Buscar por domínio
- **GET** `/api/estudantes/estatisticas/dominio` - Contagem por domínio
- **GET** `/api/estudantes/estatisticas/nomes` - Estatísticas de completude de nomes
- **GET** `/api/estudantes/count` - Total de estudantes

## Características Técnicas

### ✅ Requisitos Atendidos:

1. **JDBC Explícito**: Todos os comandos SQL são escritos manualmente usando `JdbcTemplate`
2. **MySQL**: Configurado e pronto para uso
3. **CRUD 2 Tabelas**: Implementado para Vaga e Estudante
4. **4+ Consultas Complexas**: Implementadas com diferentes níveis de dificuldade
5. **JOIN**: Múltiplas consultas com JOIN entre tabelas
6. **Gráficos**: Endpoints formatados para Chart.js, D3.js ou similar
7. **Visualização**: Endpoints para tabelas e relatórios

### 🛠️ Tecnologias Utilizadas:
- **Spring Boot 3.5.6**
- **MySQL** com JDBC
- **JdbcTemplate** para SQL explícito
- **Lombok** para redução de boilerplate
- **CORS** habilitado para frontend

### 🔧 Configurações:
- **Porta**: 8080 (padrão)
- **CORS**: Habilitado para todas as origens (`*`)
- **MySQL**: Configurado no `application.properties`
- **Logs SQL**: Habilitados para debug

## Exemplos de Uso Frontend

### Buscar todas as vagas:
```javascript
fetch('http://localhost:8080/api/vagas')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Criar nova vaga:
```javascript
fetch('http://localhost:8080/api/vagas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    titulo: "Desenvolvedor Java",
    descricao: "Vaga para desenvolvedor Java Sênior",
    carga_horaria: 40,
    modalidades: "HIBRIDO"
  })
})
.then(response => response.text())
.then(data => console.log(data));
```

### Obter dados para gráfico:
```javascript
fetch('http://localhost:8080/api/dashboard/grafico/vagas-modalidade')
  .then(response => response.json())
  .then(grafico => {
    // grafico.dados contém array com [modalidade, quantidade]
    // grafico.tipo = "pie"
    // grafico.titulo = "Distribuição de Vagas por Modalidade"
  });
```

### Executar consulta personalizada:
```javascript
fetch('http://localhost:8080/api/consultas/personalizada', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    sql: "SELECT modalidades, COUNT(*) FROM tb_vaga GROUP BY modalidades"
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## Estrutura do Projeto

```
src/main/java/br/com/cs/oportunitech/trabalho_bd/
├── entities/           # Entidades JPA
├── repository/         # Repositórios com JDBC explícito
├── controller/         # Controllers REST
└── TrabalhoBdApplication.java
```

### Repositórios:
- `VagaRepository` - CRUD e consultas para vagas
- `EstudanteRepository` - CRUD e consultas para estudantes  
- `ConsultasComplexasRepository` - Consultas com JOINs e análises

### Controllers:
- `VagaController` - Endpoints CRUD para vagas
- `EstudanteController` - Endpoints CRUD para estudantes
- `ConsultasComplexasController` - Endpoints de consultas complexas
- `DashboardController` - Endpoints para dashboard e gráficos

## Para Executar

1. **Banco**: Configure MySQL e atualize `application.properties`
2. **Build**: `mvn clean install`
3. **Run**: `mvn spring-boot:run`
4. **Test**: Acesse `http://localhost:8080/api/vagas`

## Scripts SQL de Exemplo

O sistema criará as tabelas automaticamente via JPA, mas você pode inserir dados de teste:

```sql
-- Inserir vagas de exemplo
INSERT INTO tb_vaga (cod_vaga, titulo, descricao, carga_horaria, modalidades) VALUES
(UUID(), 'Desenvolvedor Java', 'Vaga para desenvolvedor Java', 40, 'PRESENCIAL'),
(UUID(), 'Analista de Dados', 'Análise de dados com Python', 30, 'REMOTO'),
(UUID(), 'Designer UX/UI', 'Designer de interfaces', 20, 'HIBRIDO');

-- Inserir estudantes de exemplo
INSERT INTO tb_estudante (id, email, primeiro_nome, segundo_nome, telefone) VALUES
(UUID(), 'joao@gmail.com', 'João', 'Silva', '11999999999'),
(UUID(), 'maria@hotmail.com', 'Maria', 'Santos', '11888888888'),
(UUID(), 'pedro@outlook.com', 'Pedro', '', '11777777777');
```
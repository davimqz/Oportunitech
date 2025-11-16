package br.com.cs.oportunitech.trabalho_bd.contollers;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller REST responsável por gerenciar operações SQL e CRUD
 * das entidades do sistema Oportunitech
 */
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/sql")
public class SqlController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private DataSource dataSource;

    // =====================================================================
    // EXECUÇÃO GENÉRICA DE SQL
    // =====================================================================

    /**
     * Executa comandos SQL arbitrários (SELECT, INSERT, UPDATE, DELETE, etc.)
     * Suporta stored procedures, functions e triggers
     */
    @PostMapping("/execute")
    public ResponseEntity<?> executeSql(@RequestBody Map<String, String> body) {
        String sql = body.get("sql");
        if (sql == null || sql.isBlank()) {
            return ResponseEntity.badRequest().body("❌ Nenhum SQL informado.");
        }

        try {
            String sqlClean = sql.trim();
            String sqlLower = sqlClean.toLowerCase();

            // Verificar se é uma consulta (SELECT, SHOW, DESCRIBE, EXPLAIN)
            if (isQueryCommand(sqlLower)) {
                List<Map<String, Object>> result = jdbcTemplate.queryForList(sqlClean);
                return ResponseEntity.ok(result);
            }

            // Verificar se é criação de stored routine
            if (isStoredRoutineCreation(sqlLower)) {
                return executeStoredRoutineCreation(sqlClean);
            }

            // Verificar se contém DELIMITER
            if (sqlLower.contains("delimiter")) {
                return executeWithDelimiter(sqlClean);
            }

            // Executar comando de modificação (INSERT, UPDATE, DELETE)
            int updated = jdbcTemplate.update(sqlClean);
            return ResponseEntity.ok("✅ Operação executada com sucesso. Linhas afetadas: " + updated);

        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("❌ Erro SQL: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("❌ Erro ao executar: " + e.getMessage());
        }
    }

    /**
     * Lista todas as tabelas do banco de dados
     */
    @GetMapping("/tables")
    public ResponseEntity<List<String>> listarTabelas() {
        try {
            String sql;
            String dbProductName = jdbcTemplate.getDataSource().getConnection()
                    .getMetaData().getDatabaseProductName();

            if (dbProductName.toLowerCase().contains("postgresql")) {
                sql = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'";
            } else {
                sql = "SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE()";
            }

            List<String> tabelas = jdbcTemplate.queryForList(sql, String.class);
            return ResponseEntity.ok(tabelas);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(List.of("Erro ao buscar tabelas: " + e.getMessage()));
        }
    }

    /**
     * Deleta um registro de qualquer tabela pelo ID
     */
    @DeleteMapping("/delete")
    public ResponseEntity<String> delete(
            @RequestParam String table,
            @RequestParam int id) {

        String sql = "DELETE FROM " + table + " WHERE " + getPrimaryKeyName(table) + " = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            int rows = stmt.executeUpdate();

            if (rows > 0) {
                return ResponseEntity.ok("✅ Registro deletado com sucesso!");
            } else {
                return ResponseEntity.status(404).body("❌ Nenhum registro encontrado com esse ID.");
            }

        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Erro ao deletar: " + e.getMessage());
        }
    }

    // =====================================================================
    // CRUD - ESTUDANTE
    // =====================================================================

    @PostMapping("/estudante")
    public ResponseEntity<String> inserirEstudante(@RequestBody Map<String, Object> body) {
        try {
            // Validação dos campos obrigatórios
            if (body.get("email") == null || body.get("email").toString().isBlank()) {
                return ResponseEntity.badRequest().body("❌ Email é obrigatório");
            }
            if (body.get("primeiroNome") == null || body.get("primeiroNome").toString().isBlank()) {
                return ResponseEntity.badRequest().body("❌ Primeiro nome é obrigatório");
            }

            Integer idade = parseIntegerOrNull(body.get("idade"), "Idade");
            Integer codCurso = parseIntegerOrNull(body.get("codCurso"), "Código do curso");

            String sql = "INSERT INTO tb_estudante (email, idade, primeiro_nome, segundo_nome, telefone, cod_curso) " +
                         "VALUES (?, ?, ?, ?, ?, ?)";
            int rows = jdbcTemplate.update(sql,
                    body.get("email"),
                    idade,
                    body.get("primeiroNome"),
                    body.get("segundoNome"),
                    body.get("telefone"),
                    codCurso);

            return ResponseEntity.ok("✅ Estudante inserido com sucesso! Linhas afetadas: " + rows);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("❌ " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("❌ Erro ao inserir estudante: " + e.getMessage());
        }
    }

    @GetMapping("/estudantes")
    public ResponseEntity<List<Map<String, Object>>> listarEstudantes() {
        try {
            String sql = "SELECT * FROM tb_estudante";
            List<Map<String, Object>> result = jdbcTemplate.queryForList(sql);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/curso/{id}/estudantes")
    public ResponseEntity<List<Map<String, Object>>> listarEstudantesPorCurso(@PathVariable Long id) {
        try {
            String sql = "SELECT e.* FROM tb_estudante e " +
                        "INNER JOIN tb_estudante_curso ec ON e.id = ec.id_estudante " +
                        "WHERE ec.cod_curso = ?";
            List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/matricular")
    public ResponseEntity<String> matricular(@RequestBody Map<String, Object> body) {
        try {
            String sql = "INSERT INTO tb_estudante_curso (id_estudante, cod_curso) VALUES (?, ?)";
            int rows = jdbcTemplate.update(sql,
                    body.get("idEstudante"),
                    body.get("codCurso"));
            return ResponseEntity.ok("✅ Matrícula realizada! Linhas afetadas: " + rows);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("❌ Erro ao matricular: " + e.getMessage());
        }
    }

    // =====================================================================
    // CRUD - CURSO
    // =====================================================================

    @PostMapping("/curso")
    public ResponseEntity<String> inserirCurso(@RequestBody Map<String, Object> body) {
        try {
            if (body.get("nome") == null || body.get("nome").toString().isBlank()) {
                return ResponseEntity.badRequest().body("❌ Nome do curso é obrigatório");
            }

            Integer duracao = parseIntegerOrNull(body.get("duracao"), "Duração");
            Integer type = body.get("type") != null && !body.get("type").toString().isBlank()
                    ? Integer.parseInt(body.get("type").toString())
                    : 0; // Default: Graduação

            String sql = "INSERT INTO tb_curso (duracao, nome, type) VALUES (?, ?, ?)";
            int rows = jdbcTemplate.update(sql, duracao, body.get("nome"), type);
            return ResponseEntity.ok("✅ Curso inserido com sucesso! Linhas afetadas: " + rows);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("❌ " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("❌ Erro ao inserir curso: " + e.getMessage());
        }
    }

    @GetMapping("/cursos")
    public ResponseEntity<List<Map<String, Object>>> listarCursos() {
        try {
            String sql = "SELECT * FROM tb_curso";
            List<Map<String, Object>> result = jdbcTemplate.queryForList(sql);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/curso/{id}")
    public ResponseEntity<?> buscarCursoPorId(@PathVariable Long id) {
        try {
            String sql = "SELECT * FROM tb_curso WHERE cod_curso = ?";
            Map<String, Object> result = jdbcTemplate.queryForMap(sql, id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("❌ Erro ao buscar curso: " + e.getMessage());
        }
    }

    @PutMapping("/curso/{id}")
    public ResponseEntity<String> atualizarCurso(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            String sql = "UPDATE tb_curso SET nome = ?, duracao = ?, type = ? WHERE cod_curso = ?";
            int rows = jdbcTemplate.update(sql,
                    body.get("nome"),
                    body.get("duracao"),
                    body.get("type"),
                    id);

            if (rows > 0) {
                return ResponseEntity.ok("✅ Curso atualizado com sucesso! Linhas afetadas: " + rows);
            } else {
                return ResponseEntity.badRequest().body("❌ Curso não encontrado");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("❌ Erro ao atualizar curso: " + e.getMessage());
        }
    }

    @DeleteMapping("/curso/{id}")
    public ResponseEntity<String> deletarCurso(@PathVariable Long id) {
        try {
            String sql = "DELETE FROM tb_curso WHERE cod_curso = ?";
            int rows = jdbcTemplate.update(sql, id);

            if (rows > 0) {
                return ResponseEntity.ok("✅ Curso deletado com sucesso! Linhas afetadas: " + rows);
            } else {
                return ResponseEntity.badRequest().body("❌ Curso não encontrado");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("❌ Erro ao deletar curso: " + e.getMessage());
        }
    }

    // =====================================================================
    // CRUD - EMPRESA
    // =====================================================================

    @PostMapping("/empresa")
    public ResponseEntity<String> inserirEmpresa(@RequestBody Map<String, Object> body) {
        try {
            String sql = "INSERT INTO tb_empresa (nome, razao_social, cod_endereco) VALUES (?, ?, ?)";
            int rows = jdbcTemplate.update(sql,
                    body.get("nome"),
                    body.get("razaoSocial"),
                    body.get("codEndereco"));
            return ResponseEntity.ok("✅ Empresa inserida com sucesso! Linhas afetadas: " + rows);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("❌ Erro ao inserir empresa: " + e.getMessage());
        }
    }

    @GetMapping("/empresas")
    public ResponseEntity<List<Map<String, Object>>> listarEmpresas() {
        try {
            String sql = "SELECT * FROM tb_empresa";
            List<Map<String, Object>> result = jdbcTemplate.queryForList(sql);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }

    // =====================================================================
    // CRUD - VAGA
    // =====================================================================

    @PostMapping("/vaga")
    public ResponseEntity<String> inserirVaga(@RequestBody Map<String, Object> body) {
        try {
            // Validações
            if (body.get("titulo") == null || body.get("titulo").toString().isBlank()) {
                return ResponseEntity.badRequest().body("❌ Título é obrigatório");
            }
            if (body.get("codEmpresa") == null || body.get("codEmpresa").toString().isBlank()) {
                return ResponseEntity.badRequest().body("❌ Empresa é obrigatória");
            }

            Integer cargaHoraria = parseIntegerOrNull(body.get("cargaHoraria"), "Carga horária");
            Integer modalidades = body.get("modalidades") != null && !body.get("modalidades").toString().isBlank()
                    ? Integer.parseInt(body.get("modalidades").toString())
                    : 0;
            Integer codEmpresa = Integer.parseInt(body.get("codEmpresa").toString());

            // Buscar o nome da empresa
            String sqlBuscarEmpresa = "SELECT nome FROM tb_empresa WHERE cod_empresa = ?";
            String nomeEmpresa = jdbcTemplate.queryForObject(sqlBuscarEmpresa, String.class, codEmpresa);

            // Inserir a vaga
            String sql = "INSERT INTO tb_vaga (titulo, descricao, carga_horaria, modalidades, salario, " +
                         "cod_empresa, nome_empresa, logo_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            int rows = jdbcTemplate.update(sql,
                    body.get("titulo"),
                    body.get("descricao"),
                    cargaHoraria,
                    modalidades,
                    body.get("salario"),
                    codEmpresa,
                    nomeEmpresa,
                    body.get("logoLink"));

            return ResponseEntity.ok("✅ Vaga inserida com sucesso! Linhas afetadas: " + rows);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("❌ " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("❌ Erro ao inserir vaga: " + e.getMessage());
        }
    }

    @GetMapping("/vagas")
    public ResponseEntity<List<Map<String, Object>>> listarVagas() {
        try {
            String sql = "SELECT * FROM tb_vaga";
            List<Map<String, Object>> result = jdbcTemplate.queryForList(sql);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/vagas/empresa/{nomeEmpresa}")
    public ResponseEntity<List<Map<String, Object>>> listarVagasPorEmpresa(@PathVariable String nomeEmpresa) {
        try {
            String sql = "SELECT v.* FROM tb_vaga v " +
                        "INNER JOIN tb_empresa e ON v.cod_empresa = e.cod_empresa " +
                        "WHERE e.nome LIKE ?";
            List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, "%" + nomeEmpresa + "%");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/vagas/ordenar-salario")
    public ResponseEntity<List<Map<String, Object>>> listarVagasOrdenadasPorSalario() {
        try {
            String sql = "SELECT * FROM tb_vaga " +
                        "ORDER BY CAST(REPLACE(REPLACE(salario, 'R$', ''), ',', '.') AS DECIMAL(10,2)) DESC";
            List<Map<String, Object>> result = jdbcTemplate.queryForList(sql);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }

    // =====================================================================
    // CRUD - FUNCIONÁRIO
    // =====================================================================

    @PostMapping("/funcionario")
    public ResponseEntity<String> inserirFuncionario(@RequestBody Map<String, Object> body) {
        try {
            Integer cargo = body.get("cargo") != null && !body.get("cargo").toString().isBlank()
                    ? Integer.parseInt(body.get("cargo").toString())
                    : 1; // Default

            String sql = "INSERT INTO tb_funcionario (primeiro_nome, segundo_nome, email, cargo, cod_empresa) " +
                         "VALUES (?, ?, ?, ?, ?)";
            int rows = jdbcTemplate.update(sql,
                    body.get("primeiroNome"),
                    body.get("segundoNome"),
                    body.get("email"),
                    cargo,
                    body.get("codEmpresa"));

            return ResponseEntity.ok("✅ Funcionário inserido com sucesso! Linhas afetadas: " + rows);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("❌ Cargo deve ser um número válido");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("❌ Erro ao inserir funcionário: " + e.getMessage());
        }
    }

    @GetMapping("/funcionarios")
    public ResponseEntity<List<Map<String, Object>>> listarFuncionarios() {
        try {
            String sql = "SELECT * FROM tb_funcionario";
            List<Map<String, Object>> result = jdbcTemplate.queryForList(sql);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }

    // =====================================================================
    // CRUD - DEPARTAMENTO
    // =====================================================================

    @PostMapping("/departamento")
    public ResponseEntity<String> inserirDepartamento(@RequestBody Map<String, Object> body) {
        try {
            if (body.get("nome") == null || body.get("nome").toString().isBlank()) {
                return ResponseEntity.badRequest().body("❌ Nome do departamento é obrigatório");
            }

            Long codFuncionario = parseLongOrNull(body.get("codFuncionario"), "Código do funcionário");
            Long supervisorId = parseLongOrNull(body.get("supervisorId"), "ID do supervisor");

            String sql = "INSERT INTO tb_departamento (nome, cod_funcionario, supervisor_id) VALUES (?, ?, ?)";
            int rows = jdbcTemplate.update(sql, body.get("nome"), codFuncionario, supervisorId);
            return ResponseEntity.ok("✅ Departamento inserido com sucesso! Linhas afetadas: " + rows);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("❌ " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("❌ Erro ao inserir departamento: " + e.getMessage());
        }
    }

    @GetMapping("/departamentos")
    public ResponseEntity<List<Map<String, Object>>> listarDepartamentos() {
        try {
            String sql = "SELECT d.*, " +
                        "f.primeiro_nome as funcionario_nome, " +
                        "s.nome as supervisor_nome " +
                        "FROM tb_departamento d " +
                        "LEFT JOIN tb_funcionario f ON d.cod_funcionario = f.cod_funcionario " +
                        "LEFT JOIN tb_departamento s ON d.supervisor_id = s.cod_dep";
            List<Map<String, Object>> result = jdbcTemplate.queryForList(sql);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/departamento/{id}")
    public ResponseEntity<?> buscarDepartamentoPorId(@PathVariable Long id) {
        try {
            String sql = "SELECT d.*, " +
                        "f.primeiro_nome as funcionario_nome, " +
                        "s.nome as supervisor_nome " +
                        "FROM tb_departamento d " +
                        "LEFT JOIN tb_funcionario f ON d.cod_funcionario = f.cod_funcionario " +
                        "LEFT JOIN tb_departamento s ON d.supervisor_id = s.cod_dep " +
                        "WHERE d.cod_dep = ?";
            Map<String, Object> result = jdbcTemplate.queryForMap(sql, id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("❌ Erro ao buscar departamento: " + e.getMessage());
        }
    }

    @PutMapping("/departamento/{id}")
    public ResponseEntity<String> atualizarDepartamento(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            String sql = "UPDATE tb_departamento SET nome = ?, cod_funcionario = ?, supervisor_id = ? WHERE cod_dep = ?";
            int rows = jdbcTemplate.update(sql,
                    body.get("nome"),
                    body.get("codFuncionario"),
                    body.get("supervisorId"),
                    id);

            if (rows > 0) {
                return ResponseEntity.ok("✅ Departamento atualizado com sucesso! Linhas afetadas: " + rows);
            } else {
                return ResponseEntity.badRequest().body("❌ Departamento não encontrado");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("❌ Erro ao atualizar departamento: " + e.getMessage());
        }
    }

    // =====================================================================
    // CRUD - ENDEREÇO
    // =====================================================================

    @PostMapping("/endereco")
    public ResponseEntity<String> inserirEndereco(@RequestBody Map<String, Object> body) {
        try {
            // Validações
            if (body.get("rua") == null || body.get("rua").toString().isBlank()) {
                return ResponseEntity.badRequest().body("❌ Rua é obrigatória");
            }
            if (body.get("cidade") == null || body.get("cidade").toString().isBlank()) {
                return ResponseEntity.badRequest().body("❌ Cidade é obrigatória");
            }
            if (body.get("estado") == null || body.get("estado").toString().isBlank()) {
                return ResponseEntity.badRequest().body("❌ Estado é obrigatório");
            }

            Integer codEmpresa = parseIntegerOrNull(body.get("codEmpresa"), "Código da empresa");

            String sql = "INSERT INTO endereco (rua, numero, bairro, cidade, estado, cod_empresa) " +
                         "VALUES (?, ?, ?, ?, ?, ?)";
            int rows = jdbcTemplate.update(sql,
                    body.get("rua"),
                    body.get("numero"),
                    body.get("bairro"),
                    body.get("cidade"),
                    body.get("estado"),
                    codEmpresa);

            return ResponseEntity.ok("✅ Endereço inserido com sucesso! Linhas afetadas: " + rows);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("❌ " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("❌ Erro ao inserir endereço: " + e.getMessage());
        }
    }

    @GetMapping("/enderecos")
    public ResponseEntity<List<Map<String, Object>>> listarEnderecos() {
        try {
            String sql = "SELECT * FROM endereco";
            List<Map<String, Object>> result = jdbcTemplate.queryForList(sql);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }

    // =====================================================================
    // MÉTODOS AUXILIARES
    // =====================================================================

    /**
     * Verifica se o comando SQL é uma consulta
     */
    private boolean isQueryCommand(String sqlLower) {
        String[] queryCommands = {"select", "show", "describe", "explain"};
        for (String cmd : queryCommands) {
            if (sqlLower.startsWith(cmd)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Verifica se é criação de stored routine (function, procedure, trigger)
     */
    private boolean isStoredRoutineCreation(String sqlLower) {
        return sqlLower.startsWith("create function") ||
               sqlLower.startsWith("create procedure") ||
               sqlLower.startsWith("create trigger");
    }

    /**
     * Executa criação de stored routines
     */
    private ResponseEntity<?> executeStoredRoutineCreation(String sql) throws SQLException {
        String processedSql = preprocessStoredRoutine(sql);

        try (Connection conn = Objects.requireNonNull(jdbcTemplate.getDataSource()).getConnection();
             Statement stmt = conn.createStatement()) {
            stmt.execute(processedSql);
        }

        return ResponseEntity.ok("✅ Estrutura criada com sucesso!");
    }

    /**
     * Preprocessa stored procedures/functions removendo problemas de sintaxe
     */
    private String preprocessStoredRoutine(String sql) {
        String processed = sql;

        // Remover comandos DELIMITER
        processed = processed.replaceAll("(?i)DELIMITER\\s+\\S+\\s*", "");

        // Remover delimitadores customizados no final ($$, //)
        processed = processed.replaceAll("\\$\\$\\s*$", "");
        processed = processed.replaceAll("//\\s*$", "");

        // Garantir que termina sem ponto e vírgula extra
        processed = processed.trim();
        if (!processed.endsWith("END")) {
            processed = processed.replaceAll(";\\s*$", "");
        }

        return processed;
    }

    /**
     * Executa SQL que contém comandos DELIMITER
     */
    private ResponseEntity<?> executeWithDelimiter(String sql) throws SQLException {
        // Extrair o delimitador customizado
        String delimiter = "$$";
        String[] lines = sql.split("\n");

        for (String line : lines) {
            if (line.trim().toLowerCase().startsWith("delimiter")) {
                String[] parts = line.trim().split("\\s+");
                if (parts.length > 1) {
                    delimiter = parts[1];
                    break;
                }
            }
        }

        // Remover linhas de DELIMITER
        StringBuilder cleanSql = new StringBuilder();
        for (String line : lines) {
            if (!line.trim().toLowerCase().startsWith("delimiter")) {
                cleanSql.append(line).append("\n");
            }
        }

        // Dividir pelos delimitadores customizados
        String[] statements = cleanSql.toString().split(java.util.regex.Pattern.quote(delimiter));

        try (Connection conn = Objects.requireNonNull(jdbcTemplate.getDataSource()).getConnection()) {
            for (String statement : statements) {
                String trimmed = statement.trim();
                if (!trimmed.isEmpty() && !trimmed.equals(";")) {
                    trimmed = trimmed.replaceAll(";\\s*$", "");

                    try (Statement stmt = conn.createStatement()) {
                        stmt.execute(trimmed);
                    }
                }
            }
        }

        return ResponseEntity.ok("✅ Comandos executados com sucesso!");
    }

    /**
     * Converte um Object para Integer, retornando null se vazio
     */
    private Integer parseIntegerOrNull(Object value, String fieldName) {
        if (value == null || value.toString().isBlank()) {
            return null;
        }
        try {
            return Integer.parseInt(value.toString());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException(fieldName + " deve ser um número válido");
        }
    }

    /**
     * Converte um Object para Long, retornando null se vazio
     */
    private Long parseLongOrNull(Object value, String fieldName) {
        if (value == null || value.toString().isBlank()) {
            return null;
        }
        try {
            return Long.parseLong(value.toString());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException(fieldName + " deve ser um número válido");
        }
    }

    /**
     * Retorna o nome da chave primária baseado no nome da tabela
     */
    private String getPrimaryKeyName(String table) {
        return switch (table) {
            case "tb_estudante" -> "cod_estudante";
            case "tb_curso" -> "cod_curso";
            case "tb_empresa" -> "cod_empresa";
            case "tb_vaga" -> "cod_vaga";
            case "tb_funcionario" -> "cod_funcionario";
            case "tb_departamento" -> "cod_dep";
            case "endereco" -> "cod_endereco";
            default -> "id";
        };
    }
}
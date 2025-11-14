package br.com.cs.oportunitech.trabalho_bd.contollers;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.Map;
import java.util.Objects;

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
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(
    origins = "*",
    allowedHeaders = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
    allowCredentials = "false" // Set to false when using "*" for origins
)
@RestController
@RequestMapping("/sql")
public class SqlController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/execute")
    public ResponseEntity<?> executeSql(@RequestBody Map<String, String> body) {
        String sql = body.get("sql");
        if (sql == null || sql.isBlank()) {
            return ResponseEntity.badRequest().body("❌ Nenhum SQL informado.");
        }

        try {
            String sqlClean = sql.trim();
            String sqlLower = sqlClean.toLowerCase();

            // Comandos que são consultas
            String[] queryCommands = { "select", "show", "describe", "explain" };
            boolean isQuery = false;

            for (String cmd : queryCommands) {
                if (sqlLower.startsWith(cmd)) {
                    isQuery = true;
                    break;
                }
            }

            if (sqlLower.startsWith("create function") ||
                sqlLower.startsWith("create procedure") ||
                sqlLower.startsWith("create trigger")) {

                // Processar o SQL removendo delimiters se existirem
                String processedSql = preprocessStoredRoutine(sqlClean);
                
                try (Connection conn = Objects.requireNonNull(jdbcTemplate.getDataSource()).getConnection()) {
                    // Habilitar múltiplos statements na URL de conexão
                    // Mas como workaround, vamos executar statement por statement
                    
                    // Dividir por linhas e executar como bloco único
                    try (Statement stmt = conn.createStatement()) {
                        stmt.execute(processedSql);
                    }
                }

                return ResponseEntity.ok("✅ Estrutura criada com sucesso!");

            } else if (sqlLower.contains("delimiter")) {
                // Processar múltiplos comandos com DELIMITER
                return executeWithDelimiter(sqlClean);
                
            } else if (isQuery) {
                List<Map<String, Object>> result = jdbcTemplate.queryForList(sqlClean);
                return ResponseEntity.ok(result);

            } else {
                int updated = jdbcTemplate.update(sqlClean);
                return ResponseEntity.ok("✅ Operação executada com sucesso. Linhas afetadas: " + updated);
            }

        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("❌ Erro SQL: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("❌ Erro ao executar: " + e.getMessage());
        }
    }

    /**
     * Preprocessa stored procedures/functions removendo problemas de sintaxe
     */
    private String preprocessStoredRoutine(String sql) {
        String processed = sql;
        
        // Remover comandos DELIMITER se existirem
        processed = processed.replaceAll("(?i)DELIMITER\\s+\\S+\\s*", "");
        
        // Remover delimitadores customizados no final ($$, //, etc)
        processed = processed.replaceAll("\\$\\$\\s*$", "");
        processed = processed.replaceAll("//\\s*$", "");
        
        // Garantir que termina sem ponto e vírgula extra
        processed = processed.trim();
        if (!processed.endsWith("END")) {
            // Se não termina com END, pode ter ; sobrando
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
                    // Remover ; final se houver
                    trimmed = trimmed.replaceAll(";\\s*$", "");
                    
                    try (Statement stmt = conn.createStatement()) {
                        stmt.execute(trimmed);
                    }
                }
            }
        }
        
        return ResponseEntity.ok("✅ Comandos executados com sucesso!");
    }

    // ===================== LISTAR TABELAS =====================
    @GetMapping("/tables")
    public ResponseEntity<List<String>> listarTabelas() {
        try {
            String sql;
            String dbProductName = jdbcTemplate.getDataSource().getConnection().getMetaData().getDatabaseProductName();

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

    // ===================== ESTUDANTE =====================
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
            
            // Converter idade para Integer, tratando valores vazios
            Integer idade = null;
            if (body.get("idade") != null && !body.get("idade").toString().isBlank()) {
                try {
                    idade = Integer.parseInt(body.get("idade").toString());
                } catch (NumberFormatException e) {
                    return ResponseEntity.badRequest().body("❌ Idade deve ser um número válido");
                }
            }
            
            // Converter codCurso para Integer, tratando valores vazios
            Integer codCurso = null;
            if (body.get("codCurso") != null && !body.get("codCurso").toString().isBlank()) {
                try {
                    codCurso = Integer.parseInt(body.get("codCurso").toString());
                } catch (NumberFormatException e) {
                    return ResponseEntity.badRequest().body("❌ Código do curso deve ser um número válido");
                }
            }
            
            String sql = "INSERT INTO tb_estudante (email, idade, primeiro_nome, segundo_nome, telefone, cod_curso) VALUES (?, ?, ?, ?, ?, ?)";
            int rows = jdbcTemplate.update(
                    sql,
                    body.get("email"),
                    idade,
                    body.get("primeiroNome"),
                    body.get("segundoNome"),
                    body.get("telefone"),
                    codCurso);
            return ResponseEntity.ok("✅ Estudante inserido com sucesso! Linhas afetadas: " + rows);
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

    @PostMapping("/curso")
    public ResponseEntity<String> inserirCurso(@RequestBody Map<String, Object> body) {
        try {
            // Validação dos campos obrigatórios
            if (body.get("nome") == null || body.get("nome").toString().isBlank()) {
                return ResponseEntity.badRequest().body("❌ Nome do curso é obrigatório");
            }
            
            // Converter duração para Integer
            Integer duracao = null;
            if (body.get("duracao") != null && !body.get("duracao").toString().isBlank()) {
                try {
                    duracao = Integer.parseInt(body.get("duracao").toString());
                } catch (NumberFormatException e) {
                    return ResponseEntity.badRequest().body("❌ Duração deve ser um número válido");
                }
            }
            
            // Converter type para Integer
            Integer type = 0; // Default: Graduação
            if (body.get("type") != null && !body.get("type").toString().isBlank()) {
                try {
                    type = Integer.parseInt(body.get("type").toString());
                } catch (NumberFormatException e) {
                    return ResponseEntity.badRequest().body("❌ Type deve ser um número válido");
                }
            }
            
            String sql = "INSERT INTO tb_curso (duracao, nome, type) VALUES (?, ?, ?)";
            int rows = jdbcTemplate.update(sql, duracao, body.get("nome"), type);
            return ResponseEntity.ok("✅ Curso inserido com sucesso! Linhas afetadas: " + rows);
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
            return ResponseEntity.badRequest().body("Erro ao buscar curso: " + e.getMessage());
        }
    }

    @PutMapping("/curso/{id}")
    public ResponseEntity<String> atualizarCurso(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            String sql = "UPDATE tb_curso SET nome = ?, duracao = ?, type = ? WHERE cod_curso = ?";
            int rows = jdbcTemplate.update(
                    sql,
                    body.get("nome"),
                    body.get("duracao"),
                    body.get("type"),
                    id);
            if (rows > 0) {
                return ResponseEntity.ok("Curso atualizado com sucesso! Linhas afetadas: " + rows);
            } else {
                return ResponseEntity.badRequest().body("Curso não encontrado");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao atualizar curso: " + e.getMessage());
        }
    }

    @DeleteMapping("/curso/{id}")
    public ResponseEntity<String> deletarCurso(@PathVariable Long id) {
        try {
            String sql = "DELETE FROM tb_curso WHERE cod_curso = ?";
            int rows = jdbcTemplate.update(sql, id);
            if (rows > 0) {
                return ResponseEntity.ok("Curso deletado com sucesso! Linhas afetadas: " + rows);
            } else {
                return ResponseEntity.badRequest().body("Curso não encontrado");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao deletar curso: " + e.getMessage());
        }
    }

    @PostMapping("/empresa")
    public ResponseEntity<String> inserirEmpresa(@RequestBody Map<String, Object> body) {
        try {
            String sql = "INSERT INTO tb_empresa (nome, razao_social, cod_endereco) VALUES (?, ?, ?)";
            int rows = jdbcTemplate.update(
                    sql,
                    body.get("nome"),
                    body.get("razaoSocial"),
                    body.get("codEndereco"));
            return ResponseEntity.ok("Empresa inserida com sucesso! Linhas afetadas: " + rows);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao inserir empresa: " + e.getMessage());
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

    // ===================== VAGA =====================
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
            
            // Conversões
            Integer cargaHoraria = null;
            if (body.get("cargaHoraria") != null && !body.get("cargaHoraria").toString().isBlank()) {
                cargaHoraria = Integer.parseInt(body.get("cargaHoraria").toString());
            }
            
            Integer modalidades = 0;
            if (body.get("modalidades") != null && !body.get("modalidades").toString().isBlank()) {
                modalidades = Integer.parseInt(body.get("modalidades").toString());
            }
            
            Integer codEmpresa = Integer.parseInt(body.get("codEmpresa").toString());
            
            String sql = "INSERT INTO tb_vaga (titulo, descricao, carga_horaria, modalidades, salario, cod_empresa, logo_link) VALUES (?, ?, ?, ?, ?, ?, ?)";
            int rows = jdbcTemplate.update(sql,
                    body.get("titulo"),
                    body.get("descricao"),
                    cargaHoraria,
                    modalidades,
                    body.get("salario"),
                    codEmpresa,
                    body.get("logoLink"));
            return ResponseEntity.ok("✅ Vaga inserida com sucesso! Linhas afetadas: " + rows);
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

    @PostMapping("/matricular")
    public ResponseEntity<String> matricular(@RequestBody Map<String, Object> body) {
        try {
            String sql = "INSERT INTO tb_estudante_curso (id_estudante, cod_curso) VALUES (?, ?)";
            int rows = jdbcTemplate.update(
                    sql,
                    body.get("idEstudante"),
                    body.get("codCurso"));
            return ResponseEntity.ok("Matrícula realizada! Linhas afetadas: " + rows);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao matricular: " + e.getMessage());
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
            String sql = "SELECT * FROM tb_vaga ORDER BY CAST(REPLACE(REPLACE(salario, 'R$', ''), ',', '.') AS DECIMAL(10,2)) DESC";
            List<Map<String, Object>> result = jdbcTemplate.queryForList(sql);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/funcionario")
    public ResponseEntity<String> inserirFuncionario(@RequestBody Map<String, Object> body) {
        try {
            String sql = "INSERT INTO tb_funcionario (primeiro_nome, segundo_nome, email, cod_empresa) VALUES (?, ?, ?, ?)";
            int rows = jdbcTemplate.update(
                    sql,
                    body.get("primeiroNome"),
                    body.get("segundoNome"),
                    body.get("email"),
                    body.get("codEmpresa"));
            return ResponseEntity.ok("Funcionário inserido com sucesso! Linhas afetadas: " + rows);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao inserir funcionário: " + e.getMessage());
        }
    }


}
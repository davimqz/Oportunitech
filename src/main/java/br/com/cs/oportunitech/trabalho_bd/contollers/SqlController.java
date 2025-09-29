package br.com.cs.oportunitech.trabalho_bd.contollers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/sql")
@CrossOrigin(origins = "*")
public class SqlController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/execute")
    public ResponseEntity<?> executeSql(@RequestBody Map<String, String> body) {
        String sql = body.get("sql"); 

        System.out.println("=== DEBUG INFO ===");
        System.out.println("SQL recebido (raw): [" + sql + "]");

        try {
            String sqlClean = sql.trim();
            String sqlLower = sqlClean.toLowerCase();
            String[] queryCommands = {"select", "show", "describe", "explain"};
            boolean isQuery = false;

            for (String cmd : queryCommands) {
                if (sqlLower.startsWith(cmd)) {
                    isQuery = true;
                    System.out.println("Comando identificado como QUERY: " + cmd);
                    break;
                }
            }

            if (isQuery) {
                List<Map<String, Object>> result = jdbcTemplate.queryForList(sqlClean);
                return ResponseEntity.ok(result);
            } else {
                int updated = jdbcTemplate.update(sqlClean);
                return ResponseEntity.ok("Operação executada com sucesso. Linhas afetadas: " + updated);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao executar SQL: " + e.getMessage());
        }
    }

    @GetMapping("/tables")
    public ResponseEntity<List<Map<String, Object>>> listarTabelas() {
        try {
            List<Map<String, Object>> tabelas = jdbcTemplate.queryForList("SHOW TABLES");
            return ResponseEntity.ok(tabelas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    
    @GetMapping("/test-connection")
    public ResponseEntity<String> testConnection() {
        try {
            System.out.println("Testando conexão com queryForObject...");
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            System.out.println("Resultado da conexão: " + result);
            return ResponseEntity.ok("Conexão OK! Resultado: " + result);
        } catch (Exception e) {
            System.out.println("Erro na conexão: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro de conexão: " + e.getMessage());
        }
    }
    
    @GetMapping("/test-simple")
    public ResponseEntity<String> testSimple() {
        try {
            System.out.println("Teste simples com queryForList...");
            List<Map<String, Object>> result = jdbcTemplate.queryForList("SELECT 1 as numero");
            System.out.println("Resultado: " + result);
            return ResponseEntity.ok("Teste simples OK: " + result.toString());
        } catch (Exception e) {
            System.out.println("Erro no teste simples: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro: " + e.getMessage());
        }
    }

    @PostMapping("/estudante")
    public ResponseEntity<String> inserirEstudante(@RequestBody Map<String, Object> body) {
        try {
            String sql = "INSERT INTO tb_estudante (primeiro_nome, segundo_nome, email, telefone) VALUES (?, ?, ?, ?)";
            int rows = jdbcTemplate.update(
                sql,
                body.get("primeiroNome"),
                body.get("segundoNome"),
                body.get("email"),
                body.get("telefone")
            );
            return ResponseEntity.ok("Estudante inserido com sucesso! Linhas afetadas: " + rows);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao inserir estudante: " + e.getMessage());
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

    @PostMapping("/matricular")
    public ResponseEntity<String> matricular(@RequestBody Map<String, Object> body) {
        try {
            String sql = "INSERT INTO tb_estudante_curso (id, cod_curso) VALUES (?, ?)";
            int rows = jdbcTemplate.update(
                sql,
                body.get("idEstudante"),
                body.get("codCurso")
            );
            return ResponseEntity.ok("Matrícula realizada! Linhas afetadas: " + rows);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao matricular: " + e.getMessage());
        }
    }



}
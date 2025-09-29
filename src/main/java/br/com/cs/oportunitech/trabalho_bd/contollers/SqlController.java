package br.com.cs.oportunitech.trabalho_bd.contollers;

import java.util.List;
import java.util.Map;

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
        try {
            String sqlClean = sql.trim();
            String sqlLower = sqlClean.toLowerCase();
            String[] queryCommands = {"select", "show", "describe", "explain"};
            boolean isQuery = false;

            for (String cmd : queryCommands) {
                if (sqlLower.startsWith(cmd)) {
                    isQuery = true;
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

    @PostMapping("/estudante")
    public ResponseEntity<String> inserirEstudante(@RequestBody Map<String, Object> body) {
        try {
            String sql = "INSERT INTO tb_estudante (primeiro_nome, segundo_nome, email, telefone, idade) VALUES (?, ?, ?, ?, ?)";
            int rows = jdbcTemplate.update(
                sql,
                body.get("primeiroNome"),
                body.get("segundoNome"),
                body.get("email"),
                body.get("telefone"),
                body.get("idade")
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
            String sql = "INSERT INTO tb_estudante_curso (id_estudante, cod_curso) VALUES (?, ?)";
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

    @PostMapping("/curso")
    public ResponseEntity<String> inserirCurso(@RequestBody Map<String, Object> body) {
        try {
            String sql = "INSERT INTO tb_curso (nome, duracao) VALUES (?, ?)";
            int rows = jdbcTemplate.update(
                sql,
                body.get("nome"),
                body.get("duracao")
            );
            return ResponseEntity.ok("Curso inserido com sucesso! Linhas afetadas: " + rows);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao inserir curso: " + e.getMessage());
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
            String sql = "UPDATE tb_curso SET nome = ?, duracao = ? WHERE cod_curso = ?";
            int rows = jdbcTemplate.update(
                sql,
                body.get("nome"),
                body.get("duracao"),
                id
            );
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
}

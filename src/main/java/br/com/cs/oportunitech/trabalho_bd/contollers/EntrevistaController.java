package br.com.cs.oportunitech.trabalho_bd.contollers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/entrevista")
@CrossOrigin(origins = "*")
public class EntrevistaController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping
    public ResponseEntity<String> inserirEntrevista(@RequestBody Map<String, Object> body) {
        try {
            String sql = "INSERT INTO tb_entrevista (data, observacoes, id_estudante, cod_vaga) VALUES (?, ?, ?, ?)";
            int rows = jdbcTemplate.update(sql,
                    body.get("data"),
                    body.get("observacoes"),
                    body.get("idEstudante"),
                    body.get("codVaga"));
            return ResponseEntity.ok("Entrevista inserida com sucesso! Linhas afetadas: " + rows);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao inserir entrevista: " + e.getMessage());
        }
    }

    @GetMapping("/todas")
    public ResponseEntity<List<Map<String, Object>>> listarEntrevistas() {
        try {
            String sql = "SELECT * FROM tb_entrevista";
            return ResponseEntity.ok(jdbcTemplate.queryForList(sql));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}

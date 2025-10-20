package br.com.cs.oportunitech.trabalho_bd.contollers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/vaga")
@CrossOrigin(origins = "*")
public class VagaController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping
    public ResponseEntity<String> inserirVaga(@RequestBody Map<String, Object> body) {
        try {
            String sql = "INSERT INTO tb_vaga (titulo, descricao, salario, cod_empresa) VALUES (?, ?, ?, ?)";
            int rows = jdbcTemplate.update(sql,
                    body.get("titulo"),
                    body.get("descricao"),
                    body.get("salario"),
                    body.get("codEmpresa"));
            return ResponseEntity.ok("Vaga inserida com sucesso! Linhas afetadas: " + rows);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao inserir vaga: " + e.getMessage());
        }
    }

    @GetMapping("/todas")
    public ResponseEntity<List<Map<String, Object>>> listarVagas() {
        try {
            String sql = "SELECT * FROM tb_vaga";
            return ResponseEntity.ok(jdbcTemplate.queryForList(sql));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}

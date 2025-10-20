package br.com.cs.oportunitech.trabalho_bd.contollers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/departamento")
@CrossOrigin(origins = "*")
public class DepartamentoController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping
    public ResponseEntity<String> inserirDepartamento(@RequestBody Map<String, Object> body) {
        try {
            String sql = "INSERT INTO tb_departamento (nome, cod_empresa) VALUES (?, ?)";
            int rows = jdbcTemplate.update(sql, body.get("nome"), body.get("codEmpresa"));
            return ResponseEntity.ok("Departamento inserido com sucesso! Linhas afetadas: " + rows);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao inserir departamento: " + e.getMessage());
        }
    }

    @GetMapping("/todos")
    public ResponseEntity<List<Map<String, Object>>> listarDepartamentos() {
        try {
            String sql = "SELECT * FROM tb_departamento";
            return ResponseEntity.ok(jdbcTemplate.queryForList(sql));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}

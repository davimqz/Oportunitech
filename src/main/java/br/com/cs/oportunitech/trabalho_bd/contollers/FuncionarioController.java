package br.com.cs.oportunitech.trabalho_bd.contollers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/funcionario")
@CrossOrigin(origins = "*")
public class FuncionarioController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping
    public ResponseEntity<String> inserirFuncionario(@RequestBody Map<String, Object> body) {
        try {
            String sql = "INSERT INTO tb_funcionario (nome, cargo, salario, cod_departamento) VALUES (?, ?, ?, ?)";
            int rows = jdbcTemplate.update(sql,
                    body.get("nome"),
                    body.get("cargo"),
                    body.get("salario"),
                    body.get("codDepartamento"));
            return ResponseEntity.ok("Funcionário inserido com sucesso! Linhas afetadas: " + rows);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao inserir funcionário: " + e.getMessage());
        }
    }

    @GetMapping("/todos")
    public ResponseEntity<List<Map<String, Object>>> listarFuncionarios() {
        try {
            String sql = "SELECT * FROM tb_funcionario";
            return ResponseEntity.ok(jdbcTemplate.queryForList(sql));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}

package br.com.cs.oportunitech.trabalho_bd.contollers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/empresa")
@CrossOrigin(origins = "*")
public class EmpresaController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping
    public ResponseEntity<String> inserirEmpresa(@RequestBody Map<String, Object> body) {
        try {
            String sql = "INSERT INTO tb_empresa (nome, cnpj, telefone, email, area_atuacao) VALUES (?, ?, ?, ?, ?)";
            int rows = jdbcTemplate.update(sql,
                    body.get("nome"),
                    body.get("cnpj"),
                    body.get("telefone"),
                    body.get("email"),
                    body.get("areaAtuacao"));
            return ResponseEntity.ok("Empresa inserida com sucesso! Linhas afetadas: " + rows);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao inserir empresa: " + e.getMessage());
        }
    }

    @GetMapping("/todas")
    public ResponseEntity<List<Map<String, Object>>> listarEmpresas() {
        try {
            String sql = "SELECT * FROM tb_empresa";
            return ResponseEntity.ok(jdbcTemplate.queryForList(sql));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}

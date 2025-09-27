package br.com.cs.oportunitech.trabalho_bd.contollers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.persistence.EntityManager;

@RestController
@RequestMapping("/sql")
public class SqlController {

    @Autowired
    private EntityManager entityManager;

    @PostMapping("/execute")
    public ResponseEntity<?> executeSql(@RequestBody String sql) {
        try {
            if (sql.trim().toLowerCase().startsWith("select")) {
                List<?> result = entityManager.createNativeQuery(sql).getResultList();
                return ResponseEntity.ok(result);
            } else {
                int updated = entityManager.createNativeQuery(sql).executeUpdate();
                return ResponseEntity.ok("Linhas afetadas: " + updated);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro: " + e.getMessage());
        }
    }
}


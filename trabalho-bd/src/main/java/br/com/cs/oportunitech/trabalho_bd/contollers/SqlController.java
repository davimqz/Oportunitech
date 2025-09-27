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
    public ResponseEntity<?> executeSql(@RequestBody String sql) {
        System.out.println("=== DEBUG INFO ===");
        System.out.println("SQL recebido (raw): [" + sql + "]");
        System.out.println("SQL length: " + sql.length());
        System.out.println("SQL bytes: " + java.util.Arrays.toString(sql.getBytes()));
        
        try {
            String sqlClean = sql.trim();
            String sqlLower = sqlClean.toLowerCase();
            
            System.out.println("SQL limpo: [" + sqlClean + "]");
            System.out.println("SQL lowercase: [" + sqlLower + "]");
            System.out.println("Começa com 'select'? " + sqlLower.startsWith("select"));
            
            // Lista de comandos que retornam dados
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
                System.out.println("Executando queryForList...");
                List<Map<String, Object>> result = jdbcTemplate.queryForList(sqlClean);
                System.out.println("Resultado: " + result);
                return ResponseEntity.ok(result);
            } else {
                System.out.println("Executando update...");
                int updated = jdbcTemplate.update(sqlClean);
                System.out.println("Linhas afetadas: " + updated);
                return ResponseEntity.ok("Operação executada com sucesso. Linhas afetadas: " + updated);
            }
        } catch (Exception e) {
            System.out.println("ERRO: " + e.getClass().getName() + " - " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao executar SQL: " + e.getMessage());
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
}
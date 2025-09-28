package br.com.cs.oportunitech.trabalho_bd.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.cs.oportunitech.trabalho_bd.repository.ConsultasComplexasRepository;

@RestController
@RequestMapping("/api/consultas")
@CrossOrigin(origins = "*")
public class ConsultasComplexasController {

    @Autowired
    private ConsultasComplexasRepository consultasComplexasRepository;

    // CONSULTA COMPLEXA 1: JOIN entre Vaga e Empresa
    @GetMapping("/vagas-com-empresa")
    public ResponseEntity<List<Object[]>> vagasComEmpresa() {
        try {
            List<Object[]> resultado = consultasComplexasRepository.vagasComEmpresa();
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // CONSULTA COMPLEXA 2: Estatísticas de vagas por empresa (COM JOIN e GROUP BY)
    @GetMapping("/estatisticas-vagas-empresa")
    public ResponseEntity<List<Object[]>> estatisticasVagasPorEmpresa() {
        try {
            List<Object[]> resultado = consultasComplexasRepository.estatisticasVagasPorEmpresa();
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // CONSULTA COMPLEXA 3: Estudantes com entrevistas (COM JOIN)
    @GetMapping("/estudantes-com-entrevistas")
    public ResponseEntity<List<Object[]>> estudantesComEntrevistas() {
        try {
            List<Object[]> resultado = consultasComplexasRepository.estudantesComEntrevistas();
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // CONSULTA COMPLEXA 4: Relatório completo com múltiplos JOINs
    @GetMapping("/relatorio-completo")
    public ResponseEntity<List<Object[]>> relatorioCompleto() {
        try {
            List<Object[]> resultado = consultasComplexasRepository.relatorioCompleto();
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // MÉTRICAS GERAIS DO DASHBOARD
    @GetMapping("/metricas-gerais")
    public ResponseEntity<List<Object[]>> metricasGerais() {
        try {
            List<Object[]> resultado = consultasComplexasRepository.metricasGerais();
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // CONSULTA PARA GRÁFICO - Vagas por modalidade mensal
    @GetMapping("/vagas-modalidade-mensal")
    public ResponseEntity<List<Object[]>> vagasPorModalidadeMensal() {
        try {
            List<Object[]> resultado = consultasComplexasRepository.vagasPorModalidadeMensal();
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // CONSULTA PERSONALIZADA - Permite executar SQL personalizado
    @PostMapping("/personalizada")
    public ResponseEntity<?> executarConsultaPersonalizada(@RequestBody ConsultaPersonalizadaRequest request) {
        try {
            // Validações básicas de segurança
            String sql = request.getSql().toLowerCase().trim();
            
            // Permitir apenas SELECT
            if (!sql.startsWith("select")) {
                return ResponseEntity.badRequest()
                    .body("Apenas consultas SELECT são permitidas!");
            }

            // Bloquear comandos perigosos
            if (sql.contains("drop") || sql.contains("delete") || sql.contains("insert") || 
                sql.contains("update") || sql.contains("alter") || sql.contains("create")) {
                return ResponseEntity.badRequest()
                    .body("Comandos de modificação não são permitidos!");
            }

            List<Object[]> resultado = consultasComplexasRepository.executarConsultaPersonalizada(request.getSql());
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro ao executar consulta: " + e.getMessage());
        }
    }

    // Classe interna para receber requisições de consulta personalizada
    public static class ConsultaPersonalizadaRequest {
        private String sql;

        public String getSql() {
            return sql;
        }

        public void setSql(String sql) {
            this.sql = sql;
        }
    }
}
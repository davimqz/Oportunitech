package br.com.cs.oportunitech.trabalho_bd.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.cs.oportunitech.trabalho_bd.repository.ConsultasComplexasRepository;
import br.com.cs.oportunitech.trabalho_bd.repository.EstudanteRepository;
import br.com.cs.oportunitech.trabalho_bd.repository.VagaRepository;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private VagaRepository vagaRepository;

    @Autowired
    private EstudanteRepository estudanteRepository;

    @Autowired
    private ConsultasComplexasRepository consultasComplexasRepository;

    // DASHBOARD PRINCIPAL - Métricas gerais
    @GetMapping("/metricas")
    public ResponseEntity<Map<String, Object>> obterMetricasDashboard() {
        try {
            Map<String, Object> metricas = new HashMap<>();

            // Métricas básicas
            List<Object[]> metricasGerais = consultasComplexasRepository.metricasGerais();
            if (!metricasGerais.isEmpty()) {
                Object[] dados = metricasGerais.get(0);
                metricas.put("totalVagas", dados[0]);
                metricas.put("totalEstudantes", dados[1]);
                metricas.put("totalEmpresas", dados[2]);
                metricas.put("totalEntrevistas", dados[3]);
                metricas.put("mediaCargaHoraria", dados[4]);
            }

            return ResponseEntity.ok(metricas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GRÁFICO 1: Distribuição de vagas por modalidade (Pizza/Donut)
    @GetMapping("/grafico/vagas-modalidade")
    public ResponseEntity<Map<String, Object>> graficoVagasPorModalidade() {
        try {
            List<Object[]> dados = vagaRepository.vagasPorModalidade();
            
            Map<String, Object> grafico = new HashMap<>();
            grafico.put("tipo", "pie");
            grafico.put("titulo", "Distribuição de Vagas por Modalidade");
            grafico.put("dados", dados);
            
            return ResponseEntity.ok(grafico);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GRÁFICO 2: Distribuição de vagas por carga horária (Barras)
    @GetMapping("/grafico/vagas-carga-horaria")
    public ResponseEntity<Map<String, Object>> graficoVagasPorCargaHoraria() {
        try {
            List<Object[]> dados = vagaRepository.estatisticasVagasPorCargaHoraria();
            
            Map<String, Object> grafico = new HashMap<>();
            grafico.put("tipo", "bar");
            grafico.put("titulo", "Distribuição de Vagas por Faixa de Carga Horária");
            grafico.put("dados", dados);
            
            return ResponseEntity.ok(grafico);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GRÁFICO 3: Estudantes por domínio de email (Barras horizontais)
    @GetMapping("/grafico/estudantes-dominio")
    public ResponseEntity<Map<String, Object>> graficoEstudantesPorDominio() {
        try {
            List<Object[]> dados = estudanteRepository.estatisticasEstudantesPorDominio();
            
            Map<String, Object> grafico = new HashMap<>();
            grafico.put("tipo", "horizontalBar");
            grafico.put("titulo", "Top Domínios de Email dos Estudantes");
            grafico.put("dados", dados);
            
            return ResponseEntity.ok(grafico);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GRÁFICO 4: Completude de nomes dos estudantes (Donut)
    @GetMapping("/grafico/estudantes-nomes")
    public ResponseEntity<Map<String, Object>> graficoCompletudeNomes() {
        try {
            List<Object[]> dados = estudanteRepository.estatisticasNomesCompletos();
            
            Map<String, Object> grafico = new HashMap<>();
            grafico.put("tipo", "doughnut");
            grafico.put("titulo", "Completude dos Nomes dos Estudantes");
            grafico.put("dados", dados);
            
            return ResponseEntity.ok(grafico);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GRÁFICO 5: Vagas por modalidade ao longo do tempo (Linha)
    @GetMapping("/grafico/vagas-tempo")
    public ResponseEntity<Map<String, Object>> graficoVagasAoLongoDoTempo() {
        try {
            List<Object[]> dados = consultasComplexasRepository.vagasPorModalidadeMensal();
            
            Map<String, Object> grafico = new HashMap<>();
            grafico.put("tipo", "line");
            grafico.put("titulo", "Evolução das Vagas por Modalidade (Últimos 12 meses)");
            grafico.put("dados", dados);
            
            return ResponseEntity.ok(grafico);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // TABELA: Relatório completo para visualização
    @GetMapping("/tabela/relatorio-completo")
    public ResponseEntity<Map<String, Object>> tabelaRelatorioCompleto() {
        try {
            List<Object[]> dados = consultasComplexasRepository.relatorioCompleto();
            
            Map<String, Object> tabela = new HashMap<>();
            tabela.put("titulo", "Relatório Completo: Vagas, Empresas e Candidatos");
            tabela.put("colunas", new String[]{
                "Vaga", "Empresa", "Modalidade", "Carga Horária", 
                "Total Entrevistas", "Candidatos Únicos"
            });
            tabela.put("dados", dados);
            
            return ResponseEntity.ok(tabela);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // TABELA: Estatísticas de vagas por empresa
    @GetMapping("/tabela/vagas-empresa")
    public ResponseEntity<Map<String, Object>> tabelaVagasPorEmpresa() {
        try {
            List<Object[]> dados = consultasComplexasRepository.estatisticasVagasPorEmpresa();
            
            Map<String, Object> tabela = new HashMap<>();
            tabela.put("titulo", "Estatísticas de Vagas por Empresa");
            tabela.put("colunas", new String[]{
                "Empresa", "Total de Vagas", "Média Carga Horária", "Máxima Carga Horária"
            });
            tabela.put("dados", dados);
            
            return ResponseEntity.ok(tabela);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // DADOS COMPLETOS PARA O DASHBOARD
    @GetMapping("/completo")
    public ResponseEntity<Map<String, Object>> dashboardCompleto() {
        try {
            Map<String, Object> dashboard = new HashMap<>();

            // Métricas
            Map<String, Object> metricas = (Map<String, Object>) obterMetricasDashboard().getBody();
            dashboard.put("metricas", metricas);

            // Gráficos
            Map<String, Object> graficos = new HashMap<>();
            graficos.put("vagasModalidade", graficoVagasPorModalidade().getBody());
            graficos.put("vagasCargaHoraria", graficoVagasPorCargaHoraria().getBody());
            graficos.put("estudantesDominio", graficoEstudantesPorDominio().getBody());
            graficos.put("estudantesNomes", graficoCompletudeNomes().getBody());
            graficos.put("vagasTempo", graficoVagasAoLongoDoTempo().getBody());
            dashboard.put("graficos", graficos);

            // Tabelas
            Map<String, Object> tabelas = new HashMap<>();
            tabelas.put("relatorioCompleto", tabelaRelatorioCompleto().getBody());
            tabelas.put("vagasEmpresa", tabelaVagasPorEmpresa().getBody());
            dashboard.put("tabelas", tabelas);

            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
package br.com.cs.oportunitech.trabalho_bd.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ConsultasComplexasRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // CONSULTA COMPLEXA 1: JOIN entre Vaga e Empresa (assumindo relação)
    // Esta consulta mostra vagas com informações da empresa
    public List<Object[]> vagasComEmpresa() {
        String sql = "SELECT v.titulo, v.descricao, v.carga_horaria, v.modalidades, " +
                    "e.razao_social as empresa " +
                    "FROM tb_vaga v " +
                    "LEFT JOIN tb_empresa e ON v.cod_empresa = e.cod_empresa " +
                    "ORDER BY v.titulo";
        
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            return new Object[]{
                rs.getString("titulo"),
                rs.getString("descricao"),
                rs.getInt("carga_horaria"),
                rs.getString("modalidades"),
                rs.getString("empresa")
            };
        });
    }

    // CONSULTA COMPLEXA 2: Estatísticas de vagas por empresa (COM JOIN)
    public List<Object[]> estatisticasVagasPorEmpresa() {
        String sql = "SELECT e.razao_social as empresa, " +
                    "COUNT(v.cod_vaga) as total_vagas, " +
                    "AVG(v.carga_horaria) as media_carga_horaria, " +
                    "MAX(v.carga_horaria) as max_carga_horaria " +
                    "FROM tb_empresa e " +
                    "LEFT JOIN tb_vaga v ON e.cod_empresa = v.cod_empresa " +
                    "GROUP BY e.cod_empresa, e.razao_social " +
                    "HAVING COUNT(v.cod_vaga) > 0 " +
                    "ORDER BY total_vagas DESC";
        
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            return new Object[]{
                rs.getString("empresa"),
                rs.getInt("total_vagas"),
                rs.getDouble("media_carga_horaria"),
                rs.getInt("max_carga_horaria")
            };
        });
    }

    // CONSULTA COMPLEXA 3: Estudantes que participaram de entrevistas (COM JOIN)
    public List<Object[]> estudantesComEntrevistas() {
        String sql = "SELECT est.primeiro_nome, est.segundo_nome, est.email, " +
                    "COUNT(ent.num_entrevista) as total_entrevistas, " +
                    "MAX(ent.data) as ultima_entrevista " +
                    "FROM tb_estudante est " +
                    "INNER JOIN tb_entrevista ent ON est.id = ent.id_estudante " +
                    "GROUP BY est.id, est.primeiro_nome, est.segundo_nome, est.email " +
                    "ORDER BY total_entrevistas DESC, ultima_entrevista DESC";
        
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            return new Object[]{
                rs.getString("primeiro_nome"),
                rs.getString("segundo_nome"),
                rs.getString("email"),
                rs.getInt("total_entrevistas"),
                rs.getDate("ultima_entrevista")
            };
        });
    }

    // CONSULTA COMPLEXA 4: Análise completa com múltiplos JOINs
    public List<Object[]> relatorioCompleto() {
        String sql = "SELECT v.titulo as vaga, " +
                    "e.razao_social as empresa, " +
                    "v.modalidades, " +
                    "v.carga_horaria, " +
                    "COUNT(DISTINCT ent.num_entrevista) as total_entrevistas, " +
                    "COUNT(DISTINCT est.id) as candidatos_unicos " +
                    "FROM tb_vaga v " +
                    "LEFT JOIN tb_empresa e ON v.cod_empresa = e.cod_empresa " +
                    "LEFT JOIN tb_entrevista ent ON v.cod_vaga = ent.cod_vaga " +
                    "LEFT JOIN tb_estudante est ON ent.id_estudante = est.id " +
                    "GROUP BY v.cod_vaga, v.titulo, e.razao_social, v.modalidades, v.carga_horaria " +
                    "ORDER BY total_entrevistas DESC, candidatos_unicos DESC";
        
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            return new Object[]{
                rs.getString("vaga"),
                rs.getString("empresa"),
                rs.getString("modalidades"),
                rs.getInt("carga_horaria"),
                rs.getInt("total_entrevistas"),
                rs.getInt("candidatos_unicos")
            };
        });
    }

    // CONSULTA PARA DASHBOARD - Métricas gerais
    public List<Object[]> metricasGerais() {
        String sql = "SELECT " +
                    "(SELECT COUNT(*) FROM tb_vaga) as total_vagas, " +
                    "(SELECT COUNT(*) FROM tb_estudante) as total_estudantes, " +
                    "(SELECT COUNT(*) FROM tb_empresa) as total_empresas, " +
                    "(SELECT COUNT(*) FROM tb_entrevista) as total_entrevistas, " +
                    "(SELECT AVG(carga_horaria) FROM tb_vaga) as media_carga_horaria";
        
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            return new Object[]{
                rs.getInt("total_vagas"),
                rs.getInt("total_estudantes"),
                rs.getInt("total_empresas"),
                rs.getInt("total_entrevistas"),
                rs.getDouble("media_carga_horaria")
            };
        });
    }

    // CONSULTA PARA GRÁFICO - Vagas por modalidade ao longo do tempo
    public List<Object[]> vagasPorModalidadeMensal() {
        String sql = "SELECT " +
                    "DATE_FORMAT(v.data_criacao, '%Y-%m') as mes, " +
                    "v.modalidades, " +
                    "COUNT(*) as quantidade " +
                    "FROM tb_vaga v " +
                    "WHERE v.data_criacao >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH) " +
                    "GROUP BY DATE_FORMAT(v.data_criacao, '%Y-%m'), v.modalidades " +
                    "ORDER BY mes, v.modalidades";
        
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            return new Object[]{
                rs.getString("mes"),
                rs.getString("modalidades"),
                rs.getInt("quantidade")
            };
        });
    }

    // CONSULTA PERSONALIZADA - Permite executar SQL customizado
    public List<Object[]> executarConsultaPersonalizada(String sql) {
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            int columnCount = rs.getMetaData().getColumnCount();
            Object[] row = new Object[columnCount];
            for (int i = 1; i <= columnCount; i++) {
                row[i-1] = rs.getObject(i);
            }
            return row;
        });
    }
}
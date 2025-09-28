package br.com.cs.oportunitech.trabalho_bd.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import br.com.cs.oportunitech.trabalho_bd.entities.Vaga;
import br.com.cs.oportunitech.trabalho_bd.entities.Enum.Modalidade;

@Repository
public class VagaRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // RowMapper para mapear ResultSet para objeto Vaga
    private RowMapper<Vaga> vagaRowMapper = new RowMapper<Vaga>() {
        @Override
        public Vaga mapRow(ResultSet rs, int rowNum) throws SQLException {
            Vaga vaga = new Vaga();
            vaga.setCod_vaga(UUID.fromString(rs.getString("cod_vaga")));
            vaga.setTitulo(rs.getString("titulo"));
            vaga.setDescricao(rs.getString("descricao"));
            vaga.setCarga_horaria(rs.getInt("carga_horaria"));
            vaga.setModalidades(Modalidade.valueOf(rs.getString("modalidades")));
            return vaga;
        }
    };

    // INSERÇÃO - SQL explícito
    public void inserirVaga(Vaga vaga) {
        String sql = "INSERT INTO tb_vaga (cod_vaga, titulo, descricao, carga_horaria, modalidades) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, 
            vaga.getCod_vaga() != null ? vaga.getCod_vaga().toString() : UUID.randomUUID().toString(),
            vaga.getTitulo(),
            vaga.getDescricao(),
            vaga.getCarga_horaria(),
            vaga.getModalidades().name()
        );
    }

    // BUSCAR TODAS - SQL explícito
    public List<Vaga> buscarTodasVagas() {
        String sql = "SELECT cod_vaga, titulo, descricao, carga_horaria, modalidades FROM tb_vaga";
        return jdbcTemplate.query(sql, vagaRowMapper);
    }

    // BUSCAR POR ID - SQL explícito
    public Vaga buscarVagaPorId(UUID id) {
        String sql = "SELECT cod_vaga, titulo, descricao, carga_horaria, modalidades FROM tb_vaga WHERE cod_vaga = ?";
        List<Vaga> vagas = jdbcTemplate.query(sql, vagaRowMapper, id.toString());
        return vagas.isEmpty() ? null : vagas.get(0);
    }

    // ATUALIZAÇÃO - SQL explícito
    public void atualizarVaga(Vaga vaga) {
        String sql = "UPDATE tb_vaga SET titulo = ?, descricao = ?, carga_horaria = ?, modalidades = ? WHERE cod_vaga = ?";
        jdbcTemplate.update(sql,
            vaga.getTitulo(),
            vaga.getDescricao(),
            vaga.getCarga_horaria(),
            vaga.getModalidades().name(),
            vaga.getCod_vaga().toString()
        );
    }

    // DELEÇÃO - SQL explícito
    public void deletarVaga(UUID id) {
        String sql = "DELETE FROM tb_vaga WHERE cod_vaga = ?";
        jdbcTemplate.update(sql, id.toString());
    }

    // CONSULTA COMPLEXA 1: Vagas por modalidade com contagem
    public List<Object[]> vagasPorModalidade() {
        String sql = "SELECT modalidades, COUNT(*) as quantidade FROM tb_vaga GROUP BY modalidades";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            return new Object[]{
                rs.getString("modalidades"),
                rs.getInt("quantidade")
            };
        });
    }

    // CONSULTA COMPLEXA 2: Vagas com carga horária acima da média
    public List<Vaga> vagasComCargaHorariaAcimaMedia() {
        String sql = "SELECT cod_vaga, titulo, descricao, carga_horaria, modalidades FROM tb_vaga " +
                    "WHERE carga_horaria > (SELECT AVG(carga_horaria) FROM tb_vaga)";
        return jdbcTemplate.query(sql, vagaRowMapper);
    }

    // CONSULTA PARA ESTATÍSTICAS/GRÁFICOS
    public List<Object[]> estatisticasVagasPorCargaHoraria() {
        String sql = "SELECT " +
                    "CASE " +
                    "WHEN carga_horaria <= 20 THEN 'Até 20h' " +
                    "WHEN carga_horaria <= 40 THEN '21-40h' " +
                    "ELSE 'Mais de 40h' " +
                    "END as faixa_horaria, " +
                    "COUNT(*) as quantidade " +
                    "FROM tb_vaga " +
                    "GROUP BY " +
                    "CASE " +
                    "WHEN carga_horaria <= 20 THEN 'Até 20h' " +
                    "WHEN carga_horaria <= 40 THEN '21-40h' " +
                    "ELSE 'Mais de 40h' " +
                    "END";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            return new Object[]{
                rs.getString("faixa_horaria"),
                rs.getInt("quantidade")
            };
        });
    }
}
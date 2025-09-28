package br.com.cs.oportunitech.trabalho_bd.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import br.com.cs.oportunitech.trabalho_bd.entities.Estudante;

@Repository
public class EstudanteRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // RowMapper para mapear ResultSet para objeto Estudante
    private RowMapper<Estudante> estudanteRowMapper = new RowMapper<Estudante>() {
        @Override
        public Estudante mapRow(ResultSet rs, int rowNum) throws SQLException {
            Estudante estudante = new Estudante();
            estudante.setId(UUID.fromString(rs.getString("id")));
            estudante.setEmail(rs.getString("email"));
            estudante.setPrimeiroNome(rs.getString("primeiro_nome"));
            estudante.setSegundoNome(rs.getString("segundo_nome"));
            estudante.setTelefone(rs.getString("telefone"));
            return estudante;
        }
    };

    // INSERÇÃO - SQL explícito
    public void inserirEstudante(Estudante estudante) {
        String sql = "INSERT INTO tb_estudante (id, email, primeiro_nome, segundo_nome, telefone) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, 
            estudante.getId() != null ? estudante.getId().toString() : UUID.randomUUID().toString(),
            estudante.getEmail(),
            estudante.getPrimeiroNome(),
            estudante.getSegundoNome(),
            estudante.getTelefone()
        );
    }

    // BUSCAR TODOS - SQL explícito
    public List<Estudante> buscarTodosEstudantes() {
        String sql = "SELECT id, email, primeiro_nome, segundo_nome, telefone FROM tb_estudante";
        return jdbcTemplate.query(sql, estudanteRowMapper);
    }

    // BUSCAR POR ID - SQL explícito
    public Estudante buscarEstudantePorId(UUID id) {
        String sql = "SELECT id, email, primeiro_nome, segundo_nome, telefone FROM tb_estudante WHERE id = ?";
        List<Estudante> estudantes = jdbcTemplate.query(sql, estudanteRowMapper, id.toString());
        return estudantes.isEmpty() ? null : estudantes.get(0);
    }

    // BUSCAR POR EMAIL - SQL explícito
    public Estudante buscarEstudantePorEmail(String email) {
        String sql = "SELECT id, email, primeiro_nome, segundo_nome, telefone FROM tb_estudante WHERE email = ?";
        List<Estudante> estudantes = jdbcTemplate.query(sql, estudanteRowMapper, email);
        return estudantes.isEmpty() ? null : estudantes.get(0);
    }

    // ATUALIZAÇÃO - SQL explícito
    public void atualizarEstudante(Estudante estudante) {
        String sql = "UPDATE tb_estudante SET email = ?, primeiro_nome = ?, segundo_nome = ?, telefone = ? WHERE id = ?";
        jdbcTemplate.update(sql,
            estudante.getEmail(),
            estudante.getPrimeiroNome(),
            estudante.getSegundoNome(),
            estudante.getTelefone(),
            estudante.getId().toString()
        );
    }

    // DELEÇÃO - SQL explícito
    public void deletarEstudante(UUID id) {
        String sql = "DELETE FROM tb_estudante WHERE id = ?";
        jdbcTemplate.update(sql, id.toString());
    }

    // CONSULTA COMPLEXA: Buscar estudantes por domínio de email
    public List<Estudante> buscarEstudantesPorDominioEmail(String dominio) {
        String sql = "SELECT id, email, primeiro_nome, segundo_nome, telefone FROM tb_estudante WHERE email LIKE ?";
        return jdbcTemplate.query(sql, estudanteRowMapper, "%" + dominio);
    }

    // CONSULTA PARA ESTATÍSTICAS: Contagem de estudantes por domínio de email
    public List<Object[]> estatisticasEstudantesPorDominio() {
        String sql = "SELECT " +
                    "SUBSTRING(email, LOCATE('@', email) + 1) as dominio, " +
                    "COUNT(*) as quantidade " +
                    "FROM tb_estudante " +
                    "GROUP BY SUBSTRING(email, LOCATE('@', email) + 1) " +
                    "ORDER BY quantidade DESC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            return new Object[]{
                rs.getString("dominio"),
                rs.getInt("quantidade")
            };
        });
    }

    // CONSULTA PARA ESTATÍSTICAS: Estudantes com nome completo
    public List<Object[]> estatisticasNomesCompletos() {
        String sql = "SELECT " +
                    "CASE " +
                    "WHEN segundo_nome IS NOT NULL AND segundo_nome != '' THEN 'Nome Completo' " +
                    "ELSE 'Apenas Primeiro Nome' " +
                    "END as tipo_nome, " +
                    "COUNT(*) as quantidade " +
                    "FROM tb_estudante " +
                    "GROUP BY " +
                    "CASE " +
                    "WHEN segundo_nome IS NOT NULL AND segundo_nome != '' THEN 'Nome Completo' " +
                    "ELSE 'Apenas Primeiro Nome' " +
                    "END";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            return new Object[]{
                rs.getString("tipo_nome"),
                rs.getInt("quantidade")
            };
        });
    }

    // CONTAR TOTAL DE ESTUDANTES
    public int contarEstudantes() {
        String sql = "SELECT COUNT(*) FROM tb_estudante";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }
}
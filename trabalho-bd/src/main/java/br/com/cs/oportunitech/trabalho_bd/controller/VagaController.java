package br.com.cs.oportunitech.trabalho_bd.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.cs.oportunitech.trabalho_bd.entities.Vaga;
import br.com.cs.oportunitech.trabalho_bd.repository.VagaRepository;

@RestController
@RequestMapping("/api/vagas")
@CrossOrigin(origins = "*")
public class VagaController {

    @Autowired
    private VagaRepository vagaRepository;

    // INSERÇÃO - CREATE
    @PostMapping
    public ResponseEntity<String> criarVaga(@RequestBody Vaga vaga) {
        try {
            if (vaga.getCod_vaga() == null) {
                vaga.setCod_vaga(UUID.randomUUID());
            }
            vagaRepository.inserirVaga(vaga);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body("Vaga criada com sucesso! ID: " + vaga.getCod_vaga());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro ao criar vaga: " + e.getMessage());
        }
    }

    // VISUALIZAÇÃO - READ ALL
    @GetMapping
    public ResponseEntity<List<Vaga>> listarTodasVagas() {
        try {
            List<Vaga> vagas = vagaRepository.buscarTodasVagas();
            return ResponseEntity.ok(vagas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // VISUALIZAÇÃO - READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Vaga> buscarVagaPorId(@PathVariable UUID id) {
        try {
            Vaga vaga = vagaRepository.buscarVagaPorId(id);
            if (vaga != null) {
                return ResponseEntity.ok(vaga);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ALTERAÇÃO - UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<String> atualizarVaga(@PathVariable UUID id, @RequestBody Vaga vaga) {
        try {
            Vaga vagaExistente = vagaRepository.buscarVagaPorId(id);
            if (vagaExistente != null) {
                vaga.setCod_vaga(id);
                vagaRepository.atualizarVaga(vaga);
                return ResponseEntity.ok("Vaga atualizada com sucesso!");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro ao atualizar vaga: " + e.getMessage());
        }
    }

    // DELEÇÃO - DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletarVaga(@PathVariable UUID id) {
        try {
            Vaga vagaExistente = vagaRepository.buscarVagaPorId(id);
            if (vagaExistente != null) {
                vagaRepository.deletarVaga(id);
                return ResponseEntity.ok("Vaga deletada com sucesso!");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro ao deletar vaga: " + e.getMessage());
        }
    }

    // ESTATÍSTICAS - Vagas por modalidade
    @GetMapping("/estatisticas/modalidade")
    public ResponseEntity<List<Object[]>> vagasPorModalidade() {
        try {
            List<Object[]> estatisticas = vagaRepository.vagasPorModalidade();
            return ResponseEntity.ok(estatisticas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // CONSULTA COMPLEXA - Vagas com carga horária acima da média
    @GetMapping("/carga-horaria-acima-media")
    public ResponseEntity<List<Vaga>> vagasComCargaHorariaAcimaMedia() {
        try {
            List<Vaga> vagas = vagaRepository.vagasComCargaHorariaAcimaMedia();
            return ResponseEntity.ok(vagas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GRÁFICO - Estatísticas de vagas por carga horária
    @GetMapping("/estatisticas/carga-horaria")
    public ResponseEntity<List<Object[]>> estatisticasVagasPorCargaHoraria() {
        try {
            List<Object[]> estatisticas = vagaRepository.estatisticasVagasPorCargaHoraria();
            return ResponseEntity.ok(estatisticas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
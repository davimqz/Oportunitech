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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.cs.oportunitech.trabalho_bd.entities.Estudante;
import br.com.cs.oportunitech.trabalho_bd.repository.EstudanteRepository;

@RestController
@RequestMapping("/api/estudantes")
@CrossOrigin(origins = "*")
public class EstudanteController {

    @Autowired
    private EstudanteRepository estudanteRepository;

    // INSERÇÃO - CREATE
    @PostMapping
    public ResponseEntity<String> criarEstudante(@RequestBody Estudante estudante) {
        try {
            // Verificar se já existe estudante com esse email
            Estudante estudanteExistente = estudanteRepository.buscarEstudantePorEmail(estudante.getEmail());
            if (estudanteExistente != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Já existe um estudante com este email!");
            }

            if (estudante.getId() == null) {
                estudante.setId(UUID.randomUUID());
            }
            estudanteRepository.inserirEstudante(estudante);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body("Estudante criado com sucesso! ID: " + estudante.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro ao criar estudante: " + e.getMessage());
        }
    }

    // VISUALIZAÇÃO - READ ALL
    @GetMapping
    public ResponseEntity<List<Estudante>> listarTodosEstudantes() {
        try {
            List<Estudante> estudantes = estudanteRepository.buscarTodosEstudantes();
            return ResponseEntity.ok(estudantes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // VISUALIZAÇÃO - READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Estudante> buscarEstudantePorId(@PathVariable UUID id) {
        try {
            Estudante estudante = estudanteRepository.buscarEstudantePorId(id);
            if (estudante != null) {
                return ResponseEntity.ok(estudante);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // VISUALIZAÇÃO - READ BY EMAIL
    @GetMapping("/email/{email}")
    public ResponseEntity<Estudante> buscarEstudantePorEmail(@PathVariable String email) {
        try {
            Estudante estudante = estudanteRepository.buscarEstudantePorEmail(email);
            if (estudante != null) {
                return ResponseEntity.ok(estudante);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ALTERAÇÃO - UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<String> atualizarEstudante(@PathVariable UUID id, @RequestBody Estudante estudante) {
        try {
            Estudante estudanteExistente = estudanteRepository.buscarEstudantePorId(id);
            if (estudanteExistente != null) {
                // Verificar se o novo email já está sendo usado por outro estudante
                if (!estudanteExistente.getEmail().equals(estudante.getEmail())) {
                    Estudante estudanteComEmail = estudanteRepository.buscarEstudantePorEmail(estudante.getEmail());
                    if (estudanteComEmail != null) {
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body("Email já está sendo utilizado por outro estudante!");
                    }
                }

                estudante.setId(id);
                estudanteRepository.atualizarEstudante(estudante);
                return ResponseEntity.ok("Estudante atualizado com sucesso!");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro ao atualizar estudante: " + e.getMessage());
        }
    }

    // DELEÇÃO - DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletarEstudante(@PathVariable UUID id) {
        try {
            Estudante estudanteExistente = estudanteRepository.buscarEstudantePorId(id);
            if (estudanteExistente != null) {
                estudanteRepository.deletarEstudante(id);
                return ResponseEntity.ok("Estudante deletado com sucesso!");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro ao deletar estudante: " + e.getMessage());
        }
    }

    // CONSULTA COMPLEXA - Buscar por domínio de email
    @GetMapping("/dominio")
    public ResponseEntity<List<Estudante>> buscarPorDominioEmail(@RequestParam String dominio) {
        try {
            List<Estudante> estudantes = estudanteRepository.buscarEstudantesPorDominioEmail(dominio);
            return ResponseEntity.ok(estudantes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ESTATÍSTICAS - Estudantes por domínio
    @GetMapping("/estatisticas/dominio")
    public ResponseEntity<List<Object[]>> estatisticasEstudantesPorDominio() {
        try {
            List<Object[]> estatisticas = estudanteRepository.estatisticasEstudantesPorDominio();
            return ResponseEntity.ok(estatisticas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GRÁFICO - Estatísticas de nomes completos
    @GetMapping("/estatisticas/nomes")
    public ResponseEntity<List<Object[]>> estatisticasNomesCompletos() {
        try {
            List<Object[]> estatisticas = estudanteRepository.estatisticasNomesCompletos();
            return ResponseEntity.ok(estatisticas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // CONTAGEM TOTAL
    @GetMapping("/count")
    public ResponseEntity<Integer> contarEstudantes() {
        try {
            int total = estudanteRepository.contarEstudantes();
            return ResponseEntity.ok(total);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
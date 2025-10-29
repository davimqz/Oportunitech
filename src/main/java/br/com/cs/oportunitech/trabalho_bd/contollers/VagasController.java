package br.com.cs.oportunitech.trabalho_bd.contollers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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
import br.com.cs.oportunitech.trabalho_bd.service.VagaService;

@RestController
@RequestMapping("/api/vagas")
@CrossOrigin(origins = "http://localhost:5173/") 
public class VagasController {

    @Autowired
    private VagaService vagaService;

    @GetMapping
    public ResponseEntity<List<Vaga>> getAllGraphics() {
        return ResponseEntity.ok(vagaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vaga> getGraphicById(@PathVariable Long id) {
        Optional<Vaga> vaga = vagaService.findById(id);
        return vaga.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Vaga> createGraphic(@RequestBody Vaga vaga) {
        return ResponseEntity.ok(vagaService.createVaga(vaga));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vaga> updateGraphics(@PathVariable Long id, @RequestBody Vaga vaga) {
        Optional<Vaga> updatedVaga = vagaService.updateVaga(id, vaga);
        return updatedVaga.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGraphics(@PathVariable Long id) {
        boolean deleted = vagaService.deleteVaga(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
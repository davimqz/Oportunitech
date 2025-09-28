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
import br.com.cs.oportunitech.trabalho_bd.entities.Grafico;
import br.com.cs.oportunitech.trabalho_bd.service.GraficoService;

@RestController
@CrossOrigin(origins = {
    "http://localhost:5173",
})
@RequestMapping("/api/grafico")
public class CardController {

    @Autowired
    private GraficoService graficoService;

    @GetMapping
    public ResponseEntity<List<Grafico>> getAllGraphics() {
        return ResponseEntity.ok(graficoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Grafico> getGraphicById(@PathVariable String id) {
        Optional<Grafico> card = graficoService.findById(id);
        return card.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Grafico> createGraphic(@RequestBody Grafico card) {
        return ResponseEntity.ok(graficoService.createGrafico(card));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Grafico> updateGraphics(@PathVariable String id, @RequestBody Grafico grafico) {
        Optional<Grafico> updatedGrafico = graficoService.updateGrafico(id, grafico);
        return updatedGrafico.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCard(@PathVariable String id) {
        boolean deleted = graficoService.deleteGrafico(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
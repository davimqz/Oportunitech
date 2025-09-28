package br.com.cs.oportunitech.trabalho_bd.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.cs.oportunitech.trabalho_bd.entities.Grafico;
import br.com.cs.oportunitech.trabalho_bd.repository.GraficoRepository;

@Service
public class GraficoService {

    @Autowired
    private GraficoRepository graficoRepository;

    public List<Grafico> findAll() {
        return graficoRepository.findAll();
    }

    public Optional<Grafico> findById(String id) {
        return graficoRepository.findById(id);
    }

    public Grafico createGrafico(Grafico grafico) {
        return graficoRepository.save(grafico);
    }

    public Optional<Grafico> updateGrafico(String id, Grafico updatedGrafico) {
        return graficoRepository.findById(id).map(grafico -> {
            grafico.setName(updatedGrafico.getName());
            grafico.setDescription(updatedGrafico.getDescription());
            grafico.setImage(updatedGrafico.getImage());
            grafico.setType(updatedGrafico.getType());

            return graficoRepository.save(grafico);
        });
    }

    public boolean deleteGrafico(String id) {
        return graficoRepository.findById(id).map(grafico -> {
            graficoRepository.delete(grafico);
            return true;
        }).orElse(false);
    }
}
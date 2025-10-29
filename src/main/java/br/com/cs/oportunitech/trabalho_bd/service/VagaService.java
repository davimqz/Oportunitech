package br.com.cs.oportunitech.trabalho_bd.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.cs.oportunitech.trabalho_bd.entities.Vaga;
import br.com.cs.oportunitech.trabalho_bd.repository.VagasRepository;

@Service
public class VagaService {

    @Autowired
    private VagasRepository vagasRepository;

    public List<Vaga> findAll() {
        return vagasRepository.findAll();
    }

    public Optional<Vaga> findById(Long id) {
        return vagasRepository.findById(id);
    }

    public Vaga createVaga(Vaga vaga) {
        return vagasRepository.save(vaga);
    }

    public Optional<Vaga> updateVaga(Long id, Vaga updatedVaga) {
        return vagasRepository.findById(id).map(vaga -> {
            vaga.setTitulo(updatedVaga.getTitulo());
            vaga.setDescricao(updatedVaga.getDescricao());
            vaga.setCarga_horaria(updatedVaga.getCarga_horaria());
            vaga.setModalidades(updatedVaga.getModalidades());
            vaga.setLogoLink(updatedVaga.getLogoLink());
            vaga.setSalario(updatedVaga.getSalario());


            return vagasRepository.save(vaga);
        });
    }

    public boolean deleteVaga(Long id) {
        return vagasRepository.findById(id).map(vaga -> {
            vagasRepository.delete(vaga);
            return true;
        }).orElse(false);
    }
}
package br.com.cs.oportunitech.trabalho_bd.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.cs.oportunitech.trabalho_bd.entities.Vaga;

public interface VagasRepository extends JpaRepository<Vaga, Long> {
    
}

package br.com.cs.oportunitech.trabalho_bd.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.cs.oportunitech.trabalho_bd.entities.Grafico;

public interface GraficoRepository extends JpaRepository<Grafico, String> {
    
}

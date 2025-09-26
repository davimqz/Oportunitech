package br.com.cs.oportunitech.trabalho_bd.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.UUID;

@Entity
@Setter
@Getter
@Table (name = "tb_curso")
@NoArgsConstructor
@AllArgsConstructor
public class Curso {

    @Id
    @GeneratedValue (strategy = GenerationType.UUID)
    private UUID cod_curso;
    private String nome;
    private int duracao;
} 
    


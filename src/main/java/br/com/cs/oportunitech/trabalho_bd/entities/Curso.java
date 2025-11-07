package br.com.cs.oportunitech.trabalho_bd.entities;

import java.util.HashSet;
import java.util.Set;

import br.com.cs.oportunitech.trabalho_bd.entities.Enum.CursoEnum;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table (name = "tb_curso")
@NoArgsConstructor
@AllArgsConstructor
public class Curso {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long cod_curso;

    private String nome;
    private int duracao;

    @Enumerated(EnumType.ORDINAL)
    private CursoEnum type;

    @OneToMany(mappedBy = "curso")
    private Set<Estudante> estudantes = new HashSet<>();

} 
    


package br.com.cs.oportunitech.trabalho_bd.entities;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table(name = "tb_estudante")
@NoArgsConstructor
@AllArgsConstructor
public class Estudante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String primeiroNome;
    private String segundoNome;
    private String telefone;
    private int idade;

    @ManyToMany
    @JoinTable(
        name = "tb_estudante_curso",
        joinColumns = @JoinColumn(name = "id"),  
        inverseJoinColumns = @JoinColumn(name = "cod_curso")
    )

    private Set<Curso> cursos = new HashSet<>();

}

package br.com.cs.oportunitech.trabalho_bd.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Setter
@Getter
@Table(name = "tb_empresa")
@NoArgsConstructor
@AllArgsConstructor
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cod_empresa;

    private String nome;
    private String razaoSocial;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "cod_endereco")
    private Endereco endereco;

    @OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Vaga> vagas;

    @OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<Funcionario> funcionarios = new HashSet<>();

}

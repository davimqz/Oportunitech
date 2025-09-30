package br.com.cs.oportunitech.trabalho_bd.entities;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table(name = "tb_departamento")
@NoArgsConstructor
@AllArgsConstructor
public class Departamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cod_dep;

    private String nome;

    // Relacionamento com supervisor (auto-relacionamento ManyToOne)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supervisor_id")
    private Departamento supervisor;

    // Lista de subordinados (OneToMany auto-relacional)
    @OneToMany(mappedBy = "supervisor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Departamento> subordinados;

    // Relacionamento com o funcionário responsável pelo departamento
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cod_funcionario")
    private Funcionario funcionario;

    @Override
    public String toString() {
        return String.valueOf(cod_dep);
    }
}
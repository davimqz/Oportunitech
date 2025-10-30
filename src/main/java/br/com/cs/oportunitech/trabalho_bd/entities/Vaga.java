package br.com.cs.oportunitech.trabalho_bd.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import br.com.cs.oportunitech.trabalho_bd.entities.Enum.Modalidade;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table (name = "tb_vaga")
@NoArgsConstructor
@AllArgsConstructor
public class Vaga {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long cod_vaga;

    private String titulo;
    private String descricao;
    private int carga_horaria;
    private Modalidade modalidades;
    private String salario;
    private String nome_empresa;

    @ManyToOne
    @JoinColumn(name = "cod_empresa")
    @JsonIgnore
    private Empresa empresa;

    private String logoLink;
    
} 
    



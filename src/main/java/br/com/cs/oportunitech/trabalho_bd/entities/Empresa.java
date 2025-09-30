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

@Entity
@Setter
@Getter
@Table (name = "tb_empresa")
@NoArgsConstructor
@AllArgsConstructor
public class Empresa {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long cod_empresa;

    private String nome;
    private String razaoSocial;
    private Endereco endereco;
    
} 
    


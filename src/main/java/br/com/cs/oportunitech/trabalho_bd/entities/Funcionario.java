package br.com.cs.oportunitech.trabalho_bd.entities;

import java.util.UUID;

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
@Table (name = "tb_funcionario")
@NoArgsConstructor
@AllArgsConstructor
public class Funcionario {

    @Id
    @GeneratedValue (strategy = GenerationType.AUTO)
    private UUID cod_funcionario;
    private String primeiroNome;
    private String segundoNome;
    private String email;
    
} 
    

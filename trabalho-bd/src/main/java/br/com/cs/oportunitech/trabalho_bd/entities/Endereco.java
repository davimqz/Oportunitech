package br.com.cs.oportunitech.trabalho_bd.entities;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor

public class Endereco {
    private String rua;
    private String numero;
    private String bairro;
    private String cidade;
    private String estado;
}

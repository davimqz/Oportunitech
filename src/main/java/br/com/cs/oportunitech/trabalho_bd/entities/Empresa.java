package br.com.cs.oportunitech.trabalho_bd.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

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
    private List<Vaga> vagas;
}

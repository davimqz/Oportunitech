package br.com.cs.oportunitech.trabalho_bd.entities;

import br.com.cs.oportunitech.trabalho_bd.entities.Enum.GraficoEnum;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="tb_graficos")
public class Grafico {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;


    private String name;
    private String description;
    private String image;
    private GraficoEnum type;
}

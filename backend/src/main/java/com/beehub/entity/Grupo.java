package com.beehub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "grupo")
@Getter
@Setter
@NoArgsConstructor
public class Grupo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idGrupo;

    @Column(length = 70)
    private String nomeGrupo;

    @Min(1)
    @Max(4)
    private Integer capacidadeMaxima;

    @Column(name = "anoLetivo")
    private Integer ano;

    private String linkFoto;

    @ManyToOne
    @JoinColumn(name = "idOrientacao")
    private Orientacao orientacao;

    @OneToMany(mappedBy = "grupo")
    private List<Aluno> alunos;

    @OneToOne(mappedBy = "grupo")
    private Tcc tcc;

    @PrePersist
    public void prePersist(){
        if(this.ano == null){
            this.ano = LocalDate.now().getYear();
        }
    }
}

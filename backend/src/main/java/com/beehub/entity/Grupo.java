package com.beehub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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

    @ManyToOne
    @JoinColumn(name = "idOrientacao")
    private Orientacao orientacao;

    @OneToMany(mappedBy = "grupo")
    private List<Aluno> alunos;

    @OneToOne(mappedBy = "grupo")
    private Tcc tcc;
}

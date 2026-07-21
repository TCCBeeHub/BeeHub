package com.beehub.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

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
    @JoinColumn(name = "idCurso")
    private Curso curso;

    @OneToMany(mappedBy = "grupo")
    private List<Aluno> alunos;

    @OneToMany(mappedBy = "grupo")
    private List<Professor> professores;

    @OneToOne(mappedBy = "grupo")
    private Tcc tcc;
}

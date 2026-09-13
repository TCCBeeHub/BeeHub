package com.beehub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Entity
@Table(name = "curso")
@Getter
@Setter
@NoArgsConstructor
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCurso;

    @Column(length = 100, nullable = false)
    private String nome;

    @Column(length = 50, nullable = false)
    private String periodo;

    @ManyToOne(optional = false)
    @JoinColumn(name = "codEtec", nullable = false)
    private Etec etec;

    @OneToMany(mappedBy = "curso")
    private List<Aluno> alunos;

    @OneToMany(mappedBy = "curso")
    private List<Professor> professores;

    @OneToMany(mappedBy = "curso")
    private List<Grupo> grupos;
}

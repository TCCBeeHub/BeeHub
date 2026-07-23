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

    private Integer quantAlunos;

    @Column(length = 50)
    private String periodo;

    @ManyToOne
    @JoinColumn(name = "codEtec")
    private Etec etec;

    @OneToMany(mappedBy = "curso")
    private List<Aluno> alunos;

    @OneToMany(mappedBy = "curso")
    private List<Professor> professores;
}

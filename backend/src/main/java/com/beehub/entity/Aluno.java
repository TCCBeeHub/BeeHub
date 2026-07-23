package com.beehub.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "alunos")
@Getter
@Setter
@NoArgsConstructor
public class Aluno {

    @Id
    private Long rmAluno;

    @Column(length = 60, nullable = false)
    private String senha;

    @Column(length = 100)
    private String nome;

    @Column(length = 120)
    private String email;

    private String linkFoto;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @ManyToOne
    @JoinColumn(name = "idCurso")
    private Curso curso;

    @ManyToOne
    @JoinColumn(name = "idGrupo")
    private Grupo grupo;
}

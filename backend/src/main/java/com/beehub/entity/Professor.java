package com.beehub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "professor")
@Getter
@Setter
@NoArgsConstructor
public class Professor {

    @Id
    private Long rmProfessor;

    @Column(length = 60, nullable = false)
    private String senha;

    @Column(length = 100)
    private String nome;

    @Column(length = 120)
    private String email;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private String linkFoto;

    @ManyToOne
    @JoinColumn(name = "idCurso")
    private Curso curso;

    @ManyToOne
    @JoinColumn(name = "idGrupo")
    private Grupo grupo;
}

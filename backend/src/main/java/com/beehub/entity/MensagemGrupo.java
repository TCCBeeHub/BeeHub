package com.beehub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "mensagem_grupo")
@Getter
@Setter
@NoArgsConstructor
public class MensagemGrupo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMensagem;

    @Column(nullable = false, length = 1000)
    private String conteudo;

    @Column(nullable = false)
    private LocalDateTime enviadaEm;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idGrupo", nullable = false)
    private Grupo grupo;

    @ManyToOne
    @JoinColumn(name = "rmAluno")
    private Aluno aluno;

    @ManyToOne
    @JoinColumn(name = "rmProfessor")
    private Professor professor;

    @PrePersist
    public void prePersist() {
        if (enviadaEm == null) {
            enviadaEm = LocalDateTime.now();
        }
    }
}

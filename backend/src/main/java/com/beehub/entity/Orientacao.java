package com.beehub.entity;

import com.beehub.enums.GrupoOrientacao;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "orientacao",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"rmProfessor", "idCurso"}),
        @UniqueConstraint(columnNames = {"idCurso", "grupoOrientacao"})
    }
)
@Getter
@Setter
@NoArgsConstructor
public class Orientacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idOrientacao;

    @ManyToOne
    @JoinColumn(name = "idCurso")
    private Curso curso;

    @ManyToOne
    @JoinColumn(name = "rmProfessor")
    private Professor professor;

    @OneToMany(mappedBy = "orientacao")
    private List<Grupo> grupos;

    @Enumerated(EnumType.STRING)
    private GrupoOrientacao grupoOrientacao;
}

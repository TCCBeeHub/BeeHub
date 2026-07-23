package com.beehub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Entity
@Table(name = "etec")
@Getter
@Setter
@NoArgsConstructor
public class Etec {

    @Id
    @Column(length = 3)
    private String codEtec;

    @Column(unique = true, nullable = false, length = 100)
    private String nome;

    @OneToMany(mappedBy = "etec")
    private List<Curso> cursos;
}

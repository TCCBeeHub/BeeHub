package com.beehub.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Table(name = "etec")
@Getter
@Setter
@NoArgsConstructor
public class Etec {

    @Id
    private Long codEtec;

    @Column(unique = true, nullable = false, length = 100)
    private String nome;

    @OneToMany(mappedBy = "etec")
    private List<Curso> cursos;
}

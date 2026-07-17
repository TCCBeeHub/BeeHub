package com.beehub.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor

public class Etec {

    @Id
    private Long codEtec;
    @Column(unique = true)
    private String nome;
    @OneToMany
    private Curso curso;
}

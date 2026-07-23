package com.beehub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tcc")
@Getter
@Setter
@NoArgsConstructor
public class Tcc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codTcc;

    @Column(length = 100)
    private String tema;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private String linkFoto;

    private String linkArtigo;

    private String linkSite;

    private String linkSlide;

    @OneToOne
    @JoinColumn(name = "id_grupo", unique = true, nullable = false)
    private Grupo grupo;
}

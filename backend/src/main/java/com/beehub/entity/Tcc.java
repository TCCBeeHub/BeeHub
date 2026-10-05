package com.beehub.entity;

import com.beehub.enums.StatusTcc;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "tcc")
@Getter
@Setter
@NoArgsConstructor
public class Tcc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codTcc;

    @Column(length = 100, nullable = false)
    private String tema;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String descricao;

    private String linkFoto;

    private String linkArtigo;

    private String linkSite;

    private String linkSlide;

    private LocalDate dataCriacao;

    @Enumerated(EnumType.STRING)
    private StatusTcc status = StatusTcc.EM_ANDAMENTO;

    @OneToOne
    @JoinColumn(name = "id_grupo", unique = true, nullable = false)
    private Grupo grupo;

    @PrePersist
    public void prePersist(){
        if(this.dataCriacao == null){
            this.dataCriacao = LocalDate.now();
        }
    }
}

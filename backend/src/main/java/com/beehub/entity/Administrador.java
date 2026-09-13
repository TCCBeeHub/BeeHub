package com.beehub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "admin")
@Getter
@Setter
@NoArgsConstructor
public class Administrador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAdmin;

    @Column(length = 50, nullable = false, unique = true)
    private String user;

    @Column(nullable = false)
    private String senha;
}

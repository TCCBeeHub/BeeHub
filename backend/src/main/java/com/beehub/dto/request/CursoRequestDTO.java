package com.beehub.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CursoRequestDTO(
    @NotBlank(message = "Por favor, insira a etec do curso")
    String codEtec,

    @NotBlank(message = "Digite o nome do curso")
    String nome,

    @NotBlank(message = "Insira o período do curso")
    String periodo
) {}

package com.beehub.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CursoRequestDTO(
    @NotBlank(message = "Por favor, insira a etec do curso")
    @Pattern(regexp = ("\\d{3}"), message = "O código precisa ter 3 números.")
    String codEtec,

    @NotBlank(message = "Digite o nome do curso")
    String nome,

    @NotBlank(message = "Insira o período do curso")
    String periodo
) {}

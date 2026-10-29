package com.beehub.dto.update;

import jakarta.validation.constraints.NotBlank;

public record CursoRequestAtualizarDTO(
        @NotBlank(message = "O nome não pode estar vazio")
        String nome,

        @NotBlank(message = "Insira o periodo!")
        String periodo
) {}

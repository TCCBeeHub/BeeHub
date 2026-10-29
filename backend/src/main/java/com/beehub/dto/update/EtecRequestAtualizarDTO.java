package com.beehub.dto.update;

import jakarta.validation.constraints.NotBlank;

public record EtecRequestAtualizarDTO(
        @NotBlank(message = "O nome não pode estar vazio")
        String nome
) {}

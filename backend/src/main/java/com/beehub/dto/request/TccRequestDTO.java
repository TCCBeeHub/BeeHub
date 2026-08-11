package com.beehub.dto.request;

import jakarta.validation.constraints.NotBlank;

public record TccRequestDTO(
    @NotBlank(message = "Insira o tema do TCC")
    String tema,

    @NotBlank(message = "O seu TCC precisa de uma descrição")
    String descricao
) {}

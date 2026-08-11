package com.beehub.dto.request;

import jakarta.validation.constraints.NotBlank;

public record AdministradorRequestDTO(

    @NotBlank(message = "O nome do admin é necessário")
    String user,

    @NotBlank(message = "A senha é obrigatória")
    String senha
) {}

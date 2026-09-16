package com.beehub.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AlunoLoginRequestDTO(
        @NotNull(message = "O RM é obrigatório")
        @Size(min = 5, max = 5, message = "O RM deve ter exatamente 5 números.")
        Long rmAluno,

        @NotBlank(message = "A senha é obrigatória")
        @Size(min=6, max = 20, message = "A senha deve conter entre 6 a 20 caracteres")
        String senha
) {}

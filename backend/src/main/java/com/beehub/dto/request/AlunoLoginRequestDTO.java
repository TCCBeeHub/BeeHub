package com.beehub.dto.request;

import jakarta.validation.constraints.*;

public record AlunoLoginRequestDTO(
        @NotNull(message = "O RM é obrigatório")
        @Min(value = 10000, message = "O RM está fora da faixa esperada")
        @Max(value = 99999, message = "O RM está fora da faixa esperada")
        Long rmAluno,

        @NotBlank(message = "A senha é obrigatória")
        @Size(min=6, max = 20, message = "A senha deve conter entre 6 a 20 caracteres")
        String senha
) {}

package com.beehub.dto.request;

import jakarta.validation.constraints.*;

public record AlunoRequestDTO(
    @NotNull(message = "O RM é obrigatório")
    @Size(min = 5, max = 5, message = "O RM deve ter exatamente 5 números.")
    Long rmAluno,

    @NotBlank(message = "Por favor, insira o nome")
    String nome,

    @NotBlank(message = "A senha é obrigatória")
    @Size(min=6, max = 20, message = "A senha deve conter entre 6 a 20 caracteres")
    String senha
) {}

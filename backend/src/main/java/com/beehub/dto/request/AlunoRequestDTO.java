package com.beehub.dto.request;

import jakarta.validation.constraints.*;

public record AlunoRequestDTO(
    @NotNull(message = "O RM é obrigatório")
    @Min(value = 10000, message = "O RM está fora da faixa esperada")
    @Max(value = 99999, message = "O RM está fora da faixa esperada")
    Long rmAluno,

    @NotBlank(message = "Por favor, insira o nome")
    String nome,

    @NotBlank(message = "A senha é obrigatória")
    @Size(min=6, max = 20, message = "A senha deve conter entre 6 a 20 caracteres")
    String senha
) {}

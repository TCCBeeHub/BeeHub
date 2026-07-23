package com.beehub.dto.request;

import jakarta.validation.constraints.*;

public record AlunoRequestDTO(
    @NotBlank(message = "O RM é obrigatório")
    @Pattern(regexp = "\\d{5}", message = "O RM deve conter exatamente 5 números")
    String rmAluno,

    @NotNull(message = "A Etec é obrigatória")
    @Pattern(regexp = "\\d{3}", message = "O código da Etec deve conter exatamente 3 números")
    String codEtec,

    @NotBlank(message = "A senha é obrigatória")
    @Size(min=6, max = 20, message = "A senha deve conter entre 6 a 20 caracteres")
    String senha
) {}

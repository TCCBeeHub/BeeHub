package com.beehub.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProfessorRequestDTO(
    @NotBlank(message = "O RM é obrigatório")
    @Pattern(regexp = "\\d{5,6}", message = "O RM deve conter entre 5 a 6 números")
    String rmProfessor,

    @NotBlank(message = "A senha é obrigatória")
    @Size(min=6, max = 20, message = "A senha deve conter entre 6 a 20 caracteres")
    String senha
) {}

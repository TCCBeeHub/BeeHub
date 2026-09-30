package com.beehub.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.util.List;

public record ProfessorRequestDTO(
    @NotNull(message = "O RM é obrigatório")
    @Min(value = 10000, message = "O RM está fora da faixa esperada")
    @Max(value = 999999, message = "O RM está fora da faixa esperada")
    Long rmProfessor,

    @NotBlank(message = "Por favor, insira o nome")
    String nome,

    @NotBlank(message = "A senha é obrigatória")
    @Size(min=6, max = 20, message = "A senha deve conter entre 6 a 20 caracteres")
    String senha,

    @Valid
    List<OrientacaoRequestDTO> orientacao
) {}

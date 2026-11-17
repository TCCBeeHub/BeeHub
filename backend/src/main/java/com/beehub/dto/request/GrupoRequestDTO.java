package com.beehub.dto.request;

import jakarta.validation.constraints.*;

import java.util.List;

public record GrupoRequestDTO(
    @NotBlank(message = "O nome do grupo é necessário")
    String nomeGrupo,

    @NotNull(message = "O grupo precisa de um orientador")
    Long idOrientacao,

    @Min(1)
    @Max(4)
    Integer capacidadeMaxima,

    @NotNull(message = "Insira o ano do grupo")
    @Min(2020)
    Integer ano,

    @Size(max = 4, message = "Um grupo pode ter no máximo quatro alunos")
    List<@NotNull @Positive Long> rmsAlunos
) {}

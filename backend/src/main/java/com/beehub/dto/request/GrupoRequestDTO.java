package com.beehub.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record GrupoRequestDTO(
    @NotBlank(message = "O nome do grupo é necessário")
    String nomeGrupo,

    @NotNull(message = "Insira o id do curso")
    Long idCurso,

    @NotEmpty(message = "O grupo precisa de um orientador")
    @Size(min = 1, max = 2)
    List<Long> rmProfessores,

    @NotEmpty(message = "Os alunos DEVEM estar em um grupo")
    @Size(min = 1, max = 4)
    List<Long> rmAlunos
) {}

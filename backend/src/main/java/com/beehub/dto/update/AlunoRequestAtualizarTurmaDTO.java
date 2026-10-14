package com.beehub.dto.update;

import com.beehub.enums.GrupoOrientacao;
import jakarta.validation.constraints.NotNull;

public record AlunoRequestAtualizarTurmaDTO(
        @NotNull
        GrupoOrientacao turma
) {}

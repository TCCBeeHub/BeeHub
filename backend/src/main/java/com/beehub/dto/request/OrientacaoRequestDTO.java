package com.beehub.dto.request;

import com.beehub.enums.GrupoOrientacao;
import jakarta.validation.constraints.NotNull;

public record OrientacaoRequestDTO(
        @NotNull
        Long idCurso,

        @NotNull
        GrupoOrientacao grupo
) {
}

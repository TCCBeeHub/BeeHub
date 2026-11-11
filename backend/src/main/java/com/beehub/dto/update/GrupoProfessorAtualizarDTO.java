package com.beehub.dto.update;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record GrupoProfessorAtualizarDTO(
        @Size(max = 70)
        String nomeGrupo,

        String linkFoto,

        @Min(1)
        @Max(4)
        Integer capacidadeMaxima,

        @Min(2020)
        Integer ano
) {
}

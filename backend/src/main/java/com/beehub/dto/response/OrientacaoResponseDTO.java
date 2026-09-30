package com.beehub.dto.response;

import com.beehub.enums.GrupoOrientacao;

public record OrientacaoResponseDTO(
        String nomeCurso,
        GrupoOrientacao grupo
) {}

package com.beehub.dto.response;

import com.beehub.enums.StatusTcc;

public record TccStatusResponseDTO(
        String nomeGrupo,
        String tema,
        StatusTcc status
) {}

package com.beehub.dto.comum;

import com.beehub.enums.StatusTcc;

public record TccResumoDTO(
        Long codTcc,
        String nomeGrupo,
        String tema,
        String descricao,
        StatusTcc status
) {}

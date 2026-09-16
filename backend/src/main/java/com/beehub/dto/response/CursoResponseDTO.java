package com.beehub.dto.response;

import com.beehub.dto.comum.EtecResumoDTO;

public record CursoResponseDTO(
    Long idCurso,
    String nome,
    EtecResumoDTO etec,
    Long quantAlunos,
    String periodo
) {}

package com.beehub.dto.comum;

public record CursoUsuarioResumoDTO(
    Long idCurso,
    String nome,
    EtecResumoDTO etec,
    String periodo
) {}

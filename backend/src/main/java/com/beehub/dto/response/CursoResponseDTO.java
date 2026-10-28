package com.beehub.dto.response;

public record CursoResponseDTO(
    Long idCurso,
    String nome,
    String codEtec,
    Long quantAlunos,
    String periodo
) {}

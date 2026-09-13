package com.beehub.dto.response;

public record CursoResponseDTO(
    Long idCurso,
    String codEtec,
    String nome,
    Long quantAlunos,
    String periodo
) {}

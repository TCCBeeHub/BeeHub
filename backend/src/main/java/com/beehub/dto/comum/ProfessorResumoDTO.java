package com.beehub.dto.comum;

public record ProfessorResumoDTO(
    Long rmProfessor,
    String nome,
    CursoUsuarioResumoDTO curso,
    String urlFoto
) {}

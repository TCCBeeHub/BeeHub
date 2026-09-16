package com.beehub.dto.comum;

public record AlunoResumoDTO(
    Long rmAluno,
    String nome,
    CursoUsuarioResumoDTO curso,
    String urlFoto
) {}

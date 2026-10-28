package com.beehub.dto.comum;

import com.beehub.enums.GrupoOrientacao;

public record AlunoResumoDTO(
    Long rmAluno,
    String nome,
    GrupoOrientacao turma,
    CursoUsuarioResumoDTO curso,
    String urlFoto
) {}

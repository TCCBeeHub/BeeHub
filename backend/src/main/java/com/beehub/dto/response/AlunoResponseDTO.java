package com.beehub.dto.response;

import com.beehub.enums.GrupoOrientacao;

public record AlunoResponseDTO(
    Long rmAluno,
    String nome,
    GrupoOrientacao turma,
    String email,
    String descricao,
    String nomeCurso,
    String urlFoto
) {}

package com.beehub.dto.response;

import com.beehub.enums.GrupoOrientacao;

public record OrientacaoResponseDTO(
        Long idOrientacao,
        Long idCurso,
        Long rmProfessor,
        String nomeCurso,
        String nomeEtec,
        GrupoOrientacao turma
) {}

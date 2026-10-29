package com.beehub.dto.response;

public record AlunoLoginResponseDTO(
        Long rmAluno,
        String nome,
        String linkFoto,
        Long idCurso,
        Long idGrupo,
        String turma
) {}
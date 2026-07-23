package com.beehub.dto.response;

public record AlunoResponseDTO(
    String rmAluno,
    String nome,
    String email,
    String descricao,
    String nomeCurso,
    String urlFoto
) {}

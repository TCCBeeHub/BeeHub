package com.beehub.dto.response;

public record AlunoResponseDTO(
    Long rmAluno,
    String nome,
    String email,
    String descricao,
    String nomeCurso,
    String urlFoto
) {}

package com.beehub.dto.response;

public record ProfessorResponseDTO(
    Long rmProfessor,
    String nome,
    String email,
    String descricao,
    String nomeCurso,
    String urlFoto
) {}

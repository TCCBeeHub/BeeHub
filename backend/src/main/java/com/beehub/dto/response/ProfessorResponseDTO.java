package com.beehub.dto.response;

public record ProfessorResponseDTO(
    String rmProfessor,
    String nome,
    String email,
    String descricao,
    String nomeCurso,
    String urlFoto
) {}

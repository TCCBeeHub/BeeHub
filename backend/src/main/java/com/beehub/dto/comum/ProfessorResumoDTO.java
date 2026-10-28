package com.beehub.dto.comum;

import com.beehub.dto.response.OrientacaoResponseDTO;

import java.util.List;

public record ProfessorResumoDTO(
        Long rmProfessor,
        String nome,
        List<OrientacaoResponseDTO> orientacoes,
        String linkFoto
) {}

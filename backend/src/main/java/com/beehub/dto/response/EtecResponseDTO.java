package com.beehub.dto.response;

import com.beehub.dto.comum.CursoResumoDTO;

import java.util.List;

public record EtecResponseDTO(
    String codEtec,
    String nome,
    List<CursoResumoDTO> cursos
) {}

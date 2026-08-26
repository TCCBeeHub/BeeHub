package com.beehub.dto.response;

import com.beehub.dto.comum.AlunoResumoDTO;
import com.beehub.dto.comum.ProfessorResumoDTO;

import java.util.List;

public record GrupoResponseDTO(
    Long idGrupo,
    String nomeGrupo,
    List<ProfessorResumoDTO> professor,
    List<AlunoResumoDTO> aluno
) {}

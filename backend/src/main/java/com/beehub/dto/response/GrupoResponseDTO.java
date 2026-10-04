package com.beehub.dto.response;

import com.beehub.dto.comum.AlunoResumoDTO;
import com.beehub.dto.comum.ProfessorResumoDTO;
import com.beehub.dto.comum.UsuarioResumoDTO;

import java.util.List;

public record GrupoResponseDTO(
    Long idGrupo,
    String nomeGrupo,
    String linkFoto,
    String nomeOrientador,
    String nomeEtec,
    String nomeCurso,
    Integer ano,
    List<UsuarioResumoDTO> alunos
) {}

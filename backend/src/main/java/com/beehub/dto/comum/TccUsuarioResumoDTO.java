package com.beehub.dto.comum;

import com.beehub.enums.StatusTcc;

import java.util.List;

public record TccUsuarioResumoDTO(
        Long codTcc,
        String nomeGrupo,
        String tema,
        String descricao,
        StatusTcc status,
        List<UsuarioResumoDTO> alunos,
        String nomeProfessor
) {}

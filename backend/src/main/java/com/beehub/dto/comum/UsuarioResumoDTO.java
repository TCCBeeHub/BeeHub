package com.beehub.dto.comum;

import com.beehub.enums.GrupoOrientacao;

public record UsuarioResumoDTO(
    Long rmUsuario,
    String nome,
    String linkFoto,
    GrupoOrientacao turma,
    Long idGrupo
) {}

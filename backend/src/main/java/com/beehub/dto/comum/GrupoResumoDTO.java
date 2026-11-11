package com.beehub.dto.comum;

public record GrupoResumoDTO(
        Long idGrupo,
        Long idOrientacao,
        String linkFoto,
        String nomeGrupo,
        String nomeOrientador,
        Integer ano
) {}

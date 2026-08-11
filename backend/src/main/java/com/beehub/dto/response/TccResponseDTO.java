package com.beehub.dto.response;

public record TccResponseDTO(
    String nomeGrupo,
    String tema,
    String descricao,
    String linkFoto,
    String linkArtigo,
    String linkSite,
    String linkSlide
) {}

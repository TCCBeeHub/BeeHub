package com.beehub.dto.response;

public record TccResponseDTO(
    Long codTcc,
    String nomeGrupo,
    String tema,
    String descricao,
    String linkFoto,
    String linkArtigo,
    String linkSite,
    String linkSlide
) {}

package com.beehub.dto.response;

import com.beehub.entity.Tcc;

public record TccResponseDTO(
        Long codTcc,
        String nomeGrupo,
        String tema,
        String descricao,
        String linkFoto,
        String linkArtigo,
        String linkSite,
        String linkSlide
) {
    public TccResponseDTO(Tcc tcc){
        this(
                tcc.getCodTcc(),
                tcc.getGrupo().getNomeGrupo(),
                tcc.getTema(),
                tcc.getDescricao(),
                tcc.getGrupo().getLinkFoto(),
                tcc.getLinkArtigo(),
                tcc.getLinkSite(),
                tcc.getLinkSlide()
        );
    }
}

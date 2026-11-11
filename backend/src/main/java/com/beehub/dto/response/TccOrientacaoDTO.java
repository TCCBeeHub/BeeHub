package com.beehub.dto.response;

import com.beehub.entity.Tcc;
import com.beehub.enums.StatusTcc;

public record TccOrientacaoDTO(
        Long codTcc,
        Long idGrupo,
        String nomeGrupo,
        String tema,
        String descricao,
        String feedbackOrientador,
        String linkArtigo,
        String linkSite,
        String linkSlide,
        StatusTcc status
) {
    public TccOrientacaoDTO(Tcc tcc) {
        this(
                tcc.getCodTcc(),
                tcc.getGrupo().getIdGrupo(),
                tcc.getGrupo().getNomeGrupo(),
                tcc.getTema(),
                tcc.getDescricao(),
                tcc.getFeedbackOrientador(),
                tcc.getLinkArtigo(),
                tcc.getLinkSite(),
                tcc.getLinkSlide(),
                tcc.getStatus()
        );
    }
}

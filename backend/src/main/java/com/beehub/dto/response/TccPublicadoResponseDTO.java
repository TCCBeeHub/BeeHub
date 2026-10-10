package com.beehub.dto.response;

import com.beehub.dto.comum.UsuarioResumoDTO;
import com.beehub.entity.Tcc;

import java.util.List;

public record TccPublicadoResponseDTO(
        Long codTcc,
        String nomeGrupo,
        String tema,
        String descricao,
        String linkSite,
        String linkArtigo,
        String linkSlide,
        List<UsuarioResumoDTO> alunos,
        String nomeProfessor
) {
    public TccPublicadoResponseDTO(Tcc tcc){
        this(
                tcc.getCodTcc(),
                tcc.getGrupo().getNomeGrupo(),
                tcc.getTema(),
                tcc.getDescricao(),
                tcc.getLinkSite(),
                tcc.getLinkArtigo(),
                tcc.getLinkSlide(),
                tcc.getGrupo().getAlunos().stream()
                        .map(a -> new UsuarioResumoDTO(
                                a.getRmAluno(),
                                a.getNome(),
                                a.getLinkFoto()
                        ))
                        .toList(),
                tcc.getGrupo().getOrientacao().getProfessor().getNome()
        );
    }
}

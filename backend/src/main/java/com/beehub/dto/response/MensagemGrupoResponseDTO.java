package com.beehub.dto.response;

import com.beehub.entity.MensagemGrupo;

import java.time.LocalDateTime;

public record MensagemGrupoResponseDTO(
        Long idMensagem,
        Long rmRemetente,
        String nomeRemetente,
        String perfilRemetente,
        String conteudo,
        LocalDateTime enviadaEm
) {
    public MensagemGrupoResponseDTO(MensagemGrupo mensagem) {
        this(
                mensagem.getIdMensagem(),
                mensagem.getAluno() != null
                        ? mensagem.getAluno().getRmAluno()
                        : mensagem.getProfessor().getRmProfessor(),
                mensagem.getAluno() != null
                        ? mensagem.getAluno().getNome()
                        : mensagem.getProfessor().getNome(),
                mensagem.getAluno() != null ? "ALUNO" : "PROFESSOR",
                mensagem.getConteudo(),
                mensagem.getEnviadaEm()
        );
    }
}

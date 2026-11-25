package com.beehub.service;

import com.beehub.dto.request.MensagemGrupoRequestDTO;
import com.beehub.dto.response.MensagemGrupoResponseDTO;
import com.beehub.entity.Grupo;
import com.beehub.entity.MensagemGrupo;
import com.beehub.enums.TipoRemetenteMensagem;
import com.beehub.exceptions.AcessoNaoPermitidoException;
import com.beehub.exceptions.GrupoNaoEncontradoException;
import com.beehub.exceptions.MensagemNaoEncontradaException;
import com.beehub.exceptions.UsuarioNaoEncontradoException;
import com.beehub.repository.AlunoRepository;
import com.beehub.repository.GrupoRepository;
import com.beehub.repository.MensagemGrupoRepository;
import com.beehub.repository.ProfessorRepository;
import com.beehub.security.UsuarioValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MensagemGrupoService {
    private final MensagemGrupoRepository mensagemRepository;
    private final GrupoRepository grupoRepository;
    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final UsuarioValidator usuarioValidator;

    @Transactional(readOnly = true)
    public List<MensagemGrupoResponseDTO> listar(Long idGrupo, Long rmRemetente,
                                                 TipoRemetenteMensagem tipo) {
        validarAcesso(idGrupo, rmRemetente, tipo);
        return mensagemRepository.findTop100ByGrupo_IdGrupoOrderByEnviadaEmAsc(idGrupo)
                .stream()
                .map(MensagemGrupoResponseDTO::new)
                .toList();
    }

    @Transactional
    public MensagemGrupoResponseDTO enviar(Long idGrupo, Long rmRemetente,
                                           TipoRemetenteMensagem tipo,
                                           MensagemGrupoRequestDTO dto) {
        Grupo grupo = validarAcesso(idGrupo, rmRemetente, tipo);
        MensagemGrupo mensagem = new MensagemGrupo();
        mensagem.setGrupo(grupo);
        mensagem.setConteudo(dto.conteudo().trim());

        if (tipo == TipoRemetenteMensagem.ALUNO) {
            mensagem.setAluno(alunoRepository.findByRmAluno(rmRemetente)
                    .orElseThrow(() -> new UsuarioNaoEncontradoException("Aluno não encontrado!")));
        } else {
            mensagem.setProfessor(professorRepository.findByRmProfessor(rmRemetente)
                    .orElseThrow(() -> new UsuarioNaoEncontradoException("Professor não encontrado!")));
        }

        return new MensagemGrupoResponseDTO(mensagemRepository.save(mensagem));
    }

    @Transactional
    public MensagemGrupoResponseDTO editar(Long idGrupo, Long rmRemetente, Long idMensagem,
                                           TipoRemetenteMensagem tipo, String novoConteudo){
        validarAcesso(idGrupo, rmRemetente, tipo);

        MensagemGrupo mensagem = mensagemRepository.findById(idMensagem)
                .orElseThrow(() -> new MensagemNaoEncontradaException("Mensagem não encontrada!"));

        if (tipo == TipoRemetenteMensagem.ALUNO && !mensagem.getAluno().getRmAluno().equals(rmRemetente)) {
            throw new AcessoNaoPermitidoException("Você só pode editar suas próprias mensagens.");
        }
        if (tipo == TipoRemetenteMensagem.PROFESSOR && !mensagem.getProfessor().getRmProfessor().equals(rmRemetente)) {
            throw new AcessoNaoPermitidoException("Você só pode editar suas próprias mensagens.");
        }

        mensagem.setConteudo(novoConteudo.trim());
        return new MensagemGrupoResponseDTO(mensagemRepository.save(mensagem));
    }

    @Transactional
    public void excluir(Long idGrupo, Long idMensagem, Long rmRemetente, TipoRemetenteMensagem tipo) {
        validarAcesso(idGrupo, rmRemetente, tipo);

        MensagemGrupo mensagem = mensagemRepository.findById(idMensagem)
                .orElseThrow(() -> new RuntimeException("Mensagem não encontrada!"));

        // Verifica se quem está tentando excluir é o dono da mensagem
        if (tipo == TipoRemetenteMensagem.ALUNO && !mensagem.getAluno().getRmAluno().equals(rmRemetente)) {
            throw new AcessoNaoPermitidoException("Você só pode excluir suas próprias mensagens.");
        }
        if (tipo == TipoRemetenteMensagem.PROFESSOR && !mensagem.getProfessor().getRmProfessor().equals(rmRemetente)) {
            throw new AcessoNaoPermitidoException("Você só pode excluir suas próprias mensagens.");
        }

        mensagemRepository.delete(mensagem);
    }

    private Grupo validarAcesso(Long idGrupo, Long rmRemetente,
                                TipoRemetenteMensagem tipo) {
        Grupo grupo = grupoRepository.findByIdGrupo(idGrupo)
                .orElseThrow(() -> new GrupoNaoEncontradoException("Grupo não encontrado!"));

        if (tipo == TipoRemetenteMensagem.ALUNO) {
            usuarioValidator.validarAlunoGrupo(grupo, rmRemetente);
        } else {
            usuarioValidator.validarProfessorGrupo(grupo, rmRemetente);
        }
        return grupo;
    }
}

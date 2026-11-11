package com.beehub.controller;

import com.beehub.dto.request.MensagemGrupoRequestDTO;
import com.beehub.dto.response.MensagemGrupoResponseDTO;
import com.beehub.enums.TipoRemetenteMensagem;
import com.beehub.exceptions.AcessoNaoPermitidoException;
import com.beehub.security.SessaoValidator;
import com.beehub.service.MensagemGrupoService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/conversa/grupo/{idGrupo}")
@RequiredArgsConstructor
public class MensagemGrupoController {
    private final MensagemGrupoService mensagemService;
    private final SessaoValidator sessaoValidator;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<MensagemGrupoResponseDTO> listar(@PathVariable Long idGrupo,
                                                 HttpSession session) {
        TipoRemetenteMensagem tipo = tipoRemetente(session);
        Long rm = tipo == TipoRemetenteMensagem.PROFESSOR
                ? sessaoValidator.validarProfessorLogado(session)
                : sessaoValidator.validarAlunoLogado(session);
        return mensagemService.listar(idGrupo, rm, tipo);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MensagemGrupoResponseDTO enviar(@PathVariable Long idGrupo,
                                           @Valid @RequestBody MensagemGrupoRequestDTO dto,
                                           HttpSession session) {
        TipoRemetenteMensagem tipo = tipoRemetente(session);
        Long rm = tipo == TipoRemetenteMensagem.PROFESSOR
                ? sessaoValidator.validarProfessorLogado(session)
                : sessaoValidator.validarAlunoLogado(session);
        return mensagemService.enviar(idGrupo, rm, tipo, dto);
    }

    private TipoRemetenteMensagem tipoRemetente(HttpSession session) {
        if (session.getAttribute(SessaoValidator.PROFESSOR) != null) {
            return TipoRemetenteMensagem.PROFESSOR;
        }
        if (session.getAttribute(SessaoValidator.ALUNO) != null) {
            return TipoRemetenteMensagem.ALUNO;
        }
        throw new AcessoNaoPermitidoException(
                "A conversa está disponível somente para alunos e professores vinculados ao grupo."
        );
    }
}

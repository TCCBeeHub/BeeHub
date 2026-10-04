package com.beehub.controller;

import com.beehub.dto.comum.GrupoResumoDTO;
import com.beehub.dto.request.GrupoRequestDTO;
import com.beehub.dto.response.GrupoResponseDTO;
import com.beehub.dto.update.GrupoRequestAtualizarDTO;
import com.beehub.security.SessaoValidator;
import com.beehub.service.GrupoService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/grupo")
@RequiredArgsConstructor
public class GrupoController {
    private final GrupoService grupoService;
    private final SessaoValidator sessaoValidator;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GrupoResumoDTO criarGrupo(@Valid @RequestBody GrupoRequestDTO dto,
                                     HttpSession session){
        Long rmProfessor = sessaoValidator.validarProfessorLogado(session);
        return grupoService.cadastrarGrupo(dto, rmProfessor);
    }

    @PostMapping("/{idGrupo}/aluno/{rmAluno}")
    @ResponseStatus(HttpStatus.OK)
    public void inserirAluno(@PathVariable Long idGrupo,
                             @PathVariable Long rmAluno,
                             HttpSession session){
        Long rmProfessor = sessaoValidator.validarProfessorLogado(session);
        grupoService.adicionarAluno(rmAluno, idGrupo, rmProfessor);
    }

    @PutMapping("/{idGrupo}")
    @ResponseStatus(HttpStatus.OK)
    public GrupoResponseDTO atualizarGrupo(@PathVariable Long idGrupo,
                                           @Valid @RequestBody GrupoRequestAtualizarDTO dto,
                                           HttpSession session){
        Long rmAluno = sessaoValidator.validarAlunoLogado(session);
        return grupoService.atualizarGrupo(dto, idGrupo, rmAluno);
    }


    @GetMapping("/ano/{ano}/curso/{idCurso}")
    @ResponseStatus(HttpStatus.OK)
    public List<GrupoResumoDTO> listarTodosGruposAdmin(@PathVariable(required = false) Integer ano,
                                                       @PathVariable(required = false) Long idCurso,
                                                       HttpSession session){

        sessaoValidator.validarAdmin(session);
        return grupoService.listarTodosGrupos(ano, idCurso);
    }

    @GetMapping("/{idGrupo}")
    @ResponseStatus(HttpStatus.OK)
    public GrupoResponseDTO listarGrupo(@PathVariable Long idGrupo){

        return grupoService.listarGrupo(idGrupo);
    }

    @GetMapping("/professor/{rmProfessor}")
    @ResponseStatus(HttpStatus.OK)
    public List<GrupoResumoDTO> listarGruposProfessor(@PathVariable Long rmProfessor,
                                                      HttpSession session){

        if(session.getAttribute(SessaoValidator.ADMINISTRADOR) == null){
            sessaoValidator.validarProfessor(session, rmProfessor);
        }

        return grupoService.listarGruposDoProfessor(rmProfessor);
    }

    @DeleteMapping("/{idGrupo}/aluno/{rmAluno}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerAluno(@PathVariable Long idGrupo,
                             @PathVariable Long rmAluno,
                             HttpSession session){
        Long rmProfessor = sessaoValidator.validarProfessorLogado(session);
        grupoService.removerAluno(rmAluno, idGrupo, rmProfessor);
    }

    @DeleteMapping("/{idGrupo}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluirGrupo(@PathVariable Long idGrupo,
                             HttpSession session){
        Long rmProfessor = sessaoValidator.validarProfessorLogado(session);
        grupoService.excluirGrupo(idGrupo, rmProfessor);
    }
}

package com.beehub.controller;

import com.beehub.dto.comum.ProfessorResumoDTO;
import com.beehub.dto.comum.UsuarioResumoDTO;
import com.beehub.dto.request.ProfessorLoginRequestDTO;
import com.beehub.dto.request.ProfessorRequestDTO;
import com.beehub.dto.response.ProfessorResponseDTO;
import com.beehub.dto.update.ProfessorRequestAtualizarDTO;
import com.beehub.security.SessaoValidator;
import com.beehub.service.ProfessorService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/professor")
@RequiredArgsConstructor
public class ProfessorController {
    private final ProfessorService professorService;
    private final SessaoValidator sessaoValidator;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProfessorResumoDTO cadastrarProfessor(@Valid @RequestBody ProfessorRequestDTO dto,
                                                 HttpSession session){
        sessaoValidator.validarAdmin(session);
        return professorService.cadastrarProfessor(dto);
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public UsuarioResumoDTO loginProfessor(@Valid @RequestBody ProfessorLoginRequestDTO dto,
                                           HttpSession session){
        UsuarioResumoDTO professor = professorService.loginProfessor(dto);

        session.setAttribute(
                SessaoValidator.PROFESSOR,
                dto.rmProfessor()
        );

        return professor;
    }

    @PutMapping("/{rmProfessor}")
    @ResponseStatus(HttpStatus.OK)
    public ProfessorResponseDTO atualizarProfessor(@Valid @RequestBody ProfessorRequestAtualizarDTO dto,
                                                   @PathVariable Long rmProfessor,
                                                   HttpSession session){
        sessaoValidator.validarProfessor(session, rmProfessor);
        return professorService.atualizarProfessor(dto, rmProfessor);
    }

    @GetMapping("/curso/{idCurso}")
    @ResponseStatus(HttpStatus.OK)
    public List<UsuarioResumoDTO> listarProfessores(@PathVariable Long idCurso,
                                                    HttpSession session){
        sessaoValidator.validarAcessoInterno(session);
        return professorService.listarProfessores(idCurso);
    }

    @GetMapping("/{rmProfessor}")
    @ResponseStatus(HttpStatus.OK)
    public ProfessorResumoDTO listarProfessor(@PathVariable Long rmProfessor){
        return professorService.listarProfessor(rmProfessor);
    }

    @DeleteMapping("/{rmProfessor}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluirProfessor(@PathVariable Long rmProfessor,
                                 HttpSession session){
        sessaoValidator.validarAdmin(session);
        professorService.excluirProfessor(rmProfessor);
    }
}

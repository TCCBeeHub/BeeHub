package com.beehub.controller;

import com.beehub.security.SessaoValidator;
import com.beehub.dto.comum.AlunoResumoDTO;
import com.beehub.dto.comum.UsuarioResumoDTO;
import com.beehub.dto.request.AlunoLoginRequestDTO;
import com.beehub.dto.request.AlunoRequestDTO;
import com.beehub.dto.response.AlunoResponseDTO;
import com.beehub.dto.update.AlunoRequestAtualizarDTO;
import com.beehub.service.AlunoService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/aluno")
@RequiredArgsConstructor
public class AlunoController {
    private final AlunoService alunoService;
    private final SessaoValidator sessaoValidator;

    @PostMapping("/curso/{idCurso}")
    @ResponseStatus(HttpStatus.CREATED)
    public AlunoResumoDTO cadastrarAluno(@Valid @RequestBody AlunoRequestDTO dto,
                             @PathVariable Long idCurso,
                             HttpSession session){
        sessaoValidator.validarAdmin(session);
        return alunoService.cadastrarAluno(dto, idCurso);
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public UsuarioResumoDTO loginAluno(@Valid @RequestBody AlunoLoginRequestDTO dto,
                                       HttpSession session){

        UsuarioResumoDTO aluno = alunoService.loginAluno(dto);

        session.setAttribute(
                SessaoValidator.ALUNO,
                dto.rmAluno()
        );

        return aluno;
    }

    @PutMapping("/{rmAluno}")
    @ResponseStatus(HttpStatus.OK)
    public AlunoResponseDTO atualizarAluno(@Valid @RequestBody AlunoRequestAtualizarDTO dto,
                                           @PathVariable Long rmAluno,
                                           HttpSession session){
        sessaoValidator.validarAluno(session, rmAluno);
        return alunoService.atualizarAluno(dto, rmAluno);
    }

    @GetMapping("/curso/{idCurso}")
    @ResponseStatus(HttpStatus.OK)
    public List<UsuarioResumoDTO> listarAlunos(@PathVariable Long idCurso,
                                               HttpSession session){

        sessaoValidator.validarAcessoInterno(session);

        return alunoService.listarAlunos(idCurso);
    }

    @GetMapping("/{rmAluno}")
    @ResponseStatus(HttpStatus.OK)
    public AlunoResumoDTO listarAluno(@PathVariable Long rmAluno){
        return alunoService.listarAluno(rmAluno);
    }

    @DeleteMapping("/{rmAluno}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluirAluno(@PathVariable Long rmAluno,
                             HttpSession session){
        sessaoValidator.validarAdmin(session);
        alunoService.excluirAluno(rmAluno);
    }
}

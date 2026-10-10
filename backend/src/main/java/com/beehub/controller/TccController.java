package com.beehub.controller;

import com.beehub.dto.comum.TccResumoDTO;
import com.beehub.dto.request.TccRequestDTO;
import com.beehub.dto.response.TccPublicadoResponseDTO;
import com.beehub.dto.response.TccResponseDTO;
import com.beehub.dto.response.TccStatusResponseDTO;
import com.beehub.dto.update.TccRequestAtualizarDTO;
import com.beehub.security.SessaoValidator;
import com.beehub.service.TccService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tcc")
@RequiredArgsConstructor
public class TccController {
    private final TccService tccService;
    private final SessaoValidator sessaoValidator;

    @PostMapping("/grupo/{idGrupo}")
    @ResponseStatus(HttpStatus.CREATED)
    public TccResumoDTO cadastrarTcc(@PathVariable Long idGrupo,
                                     @Valid @RequestBody TccRequestDTO dto,
                                     HttpSession session){
        Long rmAluno =  sessaoValidator.validarAlunoLogado(session);
        return tccService.criarTcc(dto, idGrupo, rmAluno);
    }

    @PutMapping("/grupo/{idGrupo}")
    @ResponseStatus(HttpStatus.OK)
    public TccResponseDTO atualizarTcc(@PathVariable Long idGrupo,
                                       @Valid @RequestBody TccRequestAtualizarDTO dto,
                                       HttpSession session){
        Long rmAluno = sessaoValidator.validarAlunoLogado(session);
        return tccService.atualizarTcc(dto, idGrupo, rmAluno);
    }

    @GetMapping("/grupo/{idGrupo}")
    @ResponseStatus(HttpStatus.OK)
    public TccResumoDTO listarTccDoGrupo(@PathVariable Long idGrupo,
                                         HttpSession session){
        Long rmAluno = sessaoValidator.validarAlunoLogado(session);
        return tccService.listarTccDoGrupo(idGrupo, rmAluno);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<TccPublicadoResponseDTO> listarTccsPublicos(){
        return tccService.listarTccsPublicos();
    }

    @PutMapping("/{codTcc}/entregar")
    @ResponseStatus(HttpStatus.OK)
    public TccStatusResponseDTO entregarTcc(@PathVariable Long codTcc,
                                            HttpSession session){
        Long rmAluno = sessaoValidator.validarAlunoLogado(session);
        return tccService.entregarTcc(codTcc, rmAluno);
    }

    @PutMapping("/{codTcc}/aprovar")
    @ResponseStatus(HttpStatus.OK)
    public TccStatusResponseDTO aprovarTcc(@PathVariable Long codTcc,
                                           HttpSession session){
        Long rmProfessor = sessaoValidator.validarProfessorLogado(session);
        return tccService.aprovarTcc(codTcc, rmProfessor);
    }

    @PutMapping("/{codTcc}/reprovar")
    @ResponseStatus(HttpStatus.OK)
    public TccStatusResponseDTO reprovarTcc(@PathVariable Long codTcc,
                                            HttpSession session){
        Long rmProfessor = sessaoValidator.validarProfessorLogado(session);
        return tccService.reprovarTcc(codTcc, rmProfessor);
    }

    @PutMapping("/{codTcc}/publicar")
    @ResponseStatus(HttpStatus.OK)
    public TccStatusResponseDTO publicarTcc(@PathVariable Long codTcc,
                                            HttpSession session){
        Long rmProfessor = sessaoValidator.validarProfessorLogado(session);
        return tccService.publicarTcc(codTcc, rmProfessor);
    }

    @DeleteMapping("/grupo/{idGrupo}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluirTcc(@PathVariable Long idGrupo,
                           HttpSession session){
        Long rmProfessor = sessaoValidator.validarProfessorLogado(session);
        tccService.excluirTcc(idGrupo, rmProfessor);
    }
}

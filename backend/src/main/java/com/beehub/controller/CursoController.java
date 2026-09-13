package com.beehub.controller;

import com.beehub.dto.comum.CursoResumoDTO;
import com.beehub.dto.request.CursoRequestDTO;
import com.beehub.dto.response.CursoResponseDTO;
import com.beehub.dto.update.CursoRequestAtualizarDTO;
import com.beehub.exceptions.AcessoNaoPermitidoException;
import com.beehub.service.CursoService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cursos")
@RequiredArgsConstructor
public class CursoController {
    private final CursoService cursoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CursoResumoDTO criarCurso
            (@Valid @RequestBody CursoRequestDTO dto,
             HttpSession session){

        validarAdmin(session);

        return cursoService.cadastrarCurso(dto);
    }

    @PutMapping("/{codEtec}/{idCurso}")
    @ResponseStatus(HttpStatus.OK)
    public CursoResumoDTO atualizarCurso(@PathVariable Long idCurso,
                          @PathVariable String codEtec,
                          @Valid @RequestBody CursoRequestAtualizarDTO dto,
                          HttpSession session){

        validarAdmin(session);

        return cursoService.atualizarCurso(idCurso, codEtec, dto);
    }

    @GetMapping("/{codEtec}/{idCurso}")
    @ResponseStatus(HttpStatus.OK)
    public CursoResponseDTO listarCurso(@PathVariable Long idCurso,
                                        @PathVariable String codEtec){
        return cursoService.listarCurso(idCurso, codEtec);
    }

    @GetMapping("/{codEtec}")
    @ResponseStatus(HttpStatus.OK)
    public List<CursoResponseDTO> listarCursos(@PathVariable String codEtec){
        return cursoService.listarCursos(codEtec);
    }

    @DeleteMapping("/{idCurso}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluirCurso(@PathVariable Long idCurso,
                             HttpSession session){
        validarAdmin(session);
        cursoService.excluirCurso(idCurso);
    }

    private void validarAdmin(HttpSession session){
        Object adminId = session.getAttribute("ADMIN_AUTENTICADO");

        if(adminId == null){
            throw new AcessoNaoPermitidoException("É necessário realizar o login!");
        }
    }
}

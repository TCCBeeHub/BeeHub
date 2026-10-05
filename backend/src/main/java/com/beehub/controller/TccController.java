package com.beehub.controller;

import com.beehub.dto.comum.TccResumoDTO;
import com.beehub.dto.request.TccRequestDTO;
import com.beehub.security.SessaoValidator;
import com.beehub.service.TccService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

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
}

package com.beehub.controller;

import com.beehub.dto.request.OrientacaoRequestDTO;
import com.beehub.dto.response.OrientacaoResponseDTO;
import com.beehub.security.SessaoValidator;
import com.beehub.service.OrientacaoService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orientacao")
@RequiredArgsConstructor
public class OrientacaoController {
    private final OrientacaoService orientacaoService;
    private final SessaoValidator sessaoValidator;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrientacaoResponseDTO criarOrientacao(@Valid @RequestBody OrientacaoRequestDTO dto,
                                                 HttpSession session){
        sessaoValidator.validarAdmin(session);

        return orientacaoService.cadastrarOrientacao(dto);
    }

    @GetMapping("/professor/{rmProfessor}")
    @ResponseStatus(HttpStatus.OK)
    public List<OrientacaoResponseDTO> listarOrientacoes(@PathVariable Long rmProfessor,
                                                         HttpSession session){
        sessaoValidator.validarAcessoInterno(session);

        return orientacaoService.listarOrientacoes(rmProfessor);
    }

    @DeleteMapping("/professor/{rmProfessor}/curso/{idCurso}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluirOrientacao(@PathVariable Long rmProfessor,
                                  @PathVariable Long idCurso,
                                  HttpSession session){
        sessaoValidator.validarAdmin(session);

        orientacaoService.excluirOrientacao(rmProfessor, idCurso);

    }
}

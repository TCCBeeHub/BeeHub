package com.beehub.controller;

import com.beehub.dto.comum.EtecResumoDTO;
import com.beehub.dto.request.EtecRequestDTO;
import com.beehub.dto.update.EtecRequestAtualizarDTO;
import com.beehub.exceptions.AcessoNaoPermitidoException;
import com.beehub.service.EtecService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/etec")
@RequiredArgsConstructor
public class EtecController {
    private final EtecService etecService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EtecResumoDTO criarEtec(
            @Valid @RequestBody EtecRequestDTO dto,
            HttpSession session){
        validarAdmin(session);

        return etecService.cadastrarEtec(dto);
    }

    @PutMapping("/{codEtec}")
    @ResponseStatus(HttpStatus.OK)
    public EtecResumoDTO atualizarEtec(@PathVariable String codEtec,
                                       @Valid @RequestBody EtecRequestAtualizarDTO dto,
                                        HttpSession session){
        validarAdmin(session);

        return etecService.atualizarEtec(codEtec, dto);
    }

    @GetMapping("/{codEtec}")
    @ResponseStatus(HttpStatus.OK)
    public EtecResumoDTO listarEtec(@PathVariable String codEtec){
        return etecService.listarEtec(codEtec);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<EtecResumoDTO> listarEtecs(){
        return etecService.listarEtecs();
    }

    @DeleteMapping("/{codEtec}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluirEtec(
            @PathVariable String codEtec,
            HttpSession session){

        validarAdmin(session);

        etecService.excluirEtec(codEtec);
    }

    private void validarAdmin(HttpSession session){
        Object adminId = session.getAttribute("ADMIN_AUTENTICADO");

        if(adminId == null){
            throw new AcessoNaoPermitidoException("É necessário realizar o login!");
        }
    }
}

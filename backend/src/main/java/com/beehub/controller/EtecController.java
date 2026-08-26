package com.beehub.controller;

import com.beehub.dto.comum.EtecResumoDTO;
import com.beehub.dto.request.EtecRequestDTO;
import com.beehub.dto.update.EtecRequestAtualizarDTO;
import com.beehub.service.EtecService;
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
    public EtecResumoDTO criarEtec(@Valid @RequestBody EtecRequestDTO dto){
        return etecService.cadastrarEtec(dto);
    }

    @PutMapping("/{codEtec}")
    @ResponseStatus(HttpStatus.OK)
    public EtecResumoDTO atualizarEtec(@Valid @PathVariable String codEtec,
                                       @RequestBody EtecRequestAtualizarDTO dto){
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
    public void excluirEtec(@PathVariable String codEtec){
        etecService.excluirEtec(codEtec);
    }
}

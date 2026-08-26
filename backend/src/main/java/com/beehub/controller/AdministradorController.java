package com.beehub.controller;

import com.beehub.entity.Administrador;
import com.beehub.service.AdministradorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdministradorController {
    private final AdministradorService administradorService;

//    @PostMapping
//    @ResponseStatus(HttpStatus.CREATED)
//    public Administrador criarAdmin(@Valid @RequestBody Administrador administrador){
//        return administradorService.inserirAdmin(administrador);
//    }

}

package com.beehub.controller;

import com.beehub.service.AdministradorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdministradorController {
    private final AdministradorService administradorService;

}

package com.beehub.controller;

import com.beehub.dto.request.AdministradorRequestDTO;
import com.beehub.dto.response.AdministradorResponseDTO;
import com.beehub.service.AdministradorService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdministradorController {
    private final AdministradorService administradorService;

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public AdministradorResponseDTO logarAdmin
            (@Valid @RequestBody AdministradorRequestDTO dto,
            HttpSession session){

        AdministradorResponseDTO admin = administradorService.loginAdmin(dto);

        session.setAttribute(
               "ADMIN_AUTENTICADO",
                admin.idAdmin()
        );

        return admin;
    }

    @DeleteMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logoutAdmin(HttpSession session){
        session.invalidate();
    }
}

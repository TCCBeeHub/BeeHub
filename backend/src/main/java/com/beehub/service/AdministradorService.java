package com.beehub.service;

import com.beehub.dto.request.AdministradorRequestDTO;
import com.beehub.dto.response.AdministradorResponseDTO;
import com.beehub.entity.Administrador;
import com.beehub.exceptions.UsuarioOuSenhaIncorretaException;
import com.beehub.repository.AdministradorRepository;
import com.beehub.security.UsuarioValidator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdministradorService {
    private final AdministradorRepository administradorRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioValidator usuarioValidator;

    public AdministradorService(AdministradorRepository administradorRepository,
                                PasswordEncoder passwordEncoder, UsuarioValidator usuarioValidator){
        this.administradorRepository = administradorRepository;
        this.passwordEncoder = passwordEncoder;
        this.usuarioValidator = usuarioValidator;
    }

    public AdministradorResponseDTO loginAdmin(AdministradorRequestDTO dto){
        Administrador checarAdmin = administradorRepository.findAdministradorByUser(dto.user().trim())
                .orElseThrow(() -> new UsuarioOuSenhaIncorretaException("Usuário ou senha inválidos!"));

        usuarioValidator.validarSenha(dto.senha(), checarAdmin.getSenha());

        return new AdministradorResponseDTO(
                checarAdmin.getIdAdmin(),
                checarAdmin.getUser(),
                "Admin logado com sucesso!!!"
        );
    }
}

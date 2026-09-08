package com.beehub.service;

import com.beehub.dto.request.AdministradorRequestDTO;
import com.beehub.dto.response.AdministradorResponseDTO;
import com.beehub.entity.Administrador;
import com.beehub.exceptions.UsuarioOuSenhaIncorretaException;
import com.beehub.repository.AdministradorRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdministradorService {
    private final AdministradorRepository administradorRepository;
    private final PasswordEncoder passwordEncoder;

    public AdministradorService(AdministradorRepository administradorRepository,
                                PasswordEncoder passwordEncoder){
        this.administradorRepository = administradorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AdministradorResponseDTO loginAdmin(AdministradorRequestDTO dto){
        Administrador checarAdmin = administradorRepository.findAdministradorByUser(dto.user().trim())
                .orElseThrow(() -> new UsuarioOuSenhaIncorretaException("Usuário ou senha inválidos!"));

        validarSenha(dto.senha(), checarAdmin.getSenha());

        return new AdministradorResponseDTO(
                checarAdmin.getIdAdmin(),
                checarAdmin.getUser(),
                "Admin logado com sucesso!!!"
        );
    }

    private void validarSenha(String senhaDigitada, String senhaHashBanco){
        boolean senhaValida = passwordEncoder.matches(senhaDigitada, senhaHashBanco);
        if(!senhaValida){
            throw new UsuarioOuSenhaIncorretaException("Usuário ou senha inválidos!");
        }
    }
}

package com.beehub.service;

import com.beehub.entity.Administrador;
import com.beehub.exceptions.AdminJaEncontradoException;
import com.beehub.exceptions.RecursoNaoEncontradoException;
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

    public Administrador inserirAdmin(Administrador administrador){
        validarAdminName(administrador);
        String senhaCriptografada = passwordEncoder.encode(administrador.getSenha());
        administrador.setSenha(senhaCriptografada);
        return administradorRepository.save(administrador);
    }

    private void validarAdminName(Administrador administrador){
        if(administradorRepository.existsByUser(administrador.getUser())){
            throw new RecursoNaoEncontradoException("O usuário do Admin inserido não foi encontrado!");
        }
    }
}

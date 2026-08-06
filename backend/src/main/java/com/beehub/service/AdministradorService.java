package com.beehub.service;

import com.beehub.entity.Administrador;
import com.beehub.exceptions.AdminJaEncontradoException;
import com.beehub.exceptions.RecursoNaoEncontradoException;
import com.beehub.repository.AdministradorRepository;

public class AdministradorService {
    private final AdministradorRepository administradorRepository;

    public AdministradorService(AdministradorRepository administradorRepository){
        this.administradorRepository = administradorRepository;
    }

    public Administrador inserirAdmin(Administrador administrador){
        validarAdminName(administrador);
        return administradorRepository.save(administrador);
    }

    public void atualizarSenha(Administrador administrador, String novaSenha){
          if(administradorRepository.findAdministradorsByIdAdmin(administrador.getIdAdmin())){
              boolean idChecar = administradorRepository.findAdministradorsByIdAdmin(administrador.getIdAdmin());
              if(idChecar){
                  administrador.setSenha(novaSenha);
                  administradorRepository.save(administrador);
              }

          }
    }

    private void validarAdminName(Administrador administrador){
        if(!administradorRepository.existsByUser(administrador.getUser())){
            throw new AdminJaEncontradoException("O usuário do Admin inserido não foi encontrado!");
        }
    }
}

package com.beehub.service;

import com.beehub.dto.request.ProfessorLoginRequestDTO;
import com.beehub.dto.request.ProfessorRequestDTO;
import com.beehub.entity.Professor;
import com.beehub.exceptions.UsuarioOuSenhaIncorretaException;
import com.beehub.exceptions.UsuarioJaExisteException;
import com.beehub.exceptions.UsuarioNaoEncontradoException;
import com.beehub.repository.ProfessorRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ProfessorService {
    private final ProfessorRepository professorRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfessorService(ProfessorRepository professorRepository, PasswordEncoder passwordEncoder){
        this.professorRepository = professorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Professor cadastrarProfessor(ProfessorRequestDTO dto){
        validarRmProfessor(Long.valueOf(dto.rmProfessor()));

        Professor novoProfessor = new Professor();
        novoProfessor.setRmProfessor(Long.valueOf(dto.rmProfessor()));
        novoProfessor.setNome(dto.nome());
        novoProfessor.setSenha(passwordEncoder.encode(dto.senha()));

        return professorRepository.save(novoProfessor);
    }


    public Professor loginProfessor(ProfessorLoginRequestDTO dto){
        Long rm = Long.valueOf(dto.rmProfessor());

        Professor professorBanco = professorRepository.findByRmProfessor(rm)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Usuário não foi encontrado"));

        validarSenha(dto.senha(), professorBanco.getSenha());

        return professorBanco;
    }

    private void validarRmProfessor(Long rmProfessor){
        if(professorRepository.existsByRmProfessor(rmProfessor)){
            throw new UsuarioJaExisteException("Este Rm já está sendo usado");
        }
    }

    private void validarSenha(String senhaDigitada, String senhaHashBanco){
        boolean senhaValida = passwordEncoder.matches(senhaDigitada, senhaHashBanco);
        if(!senhaValida){
            throw new UsuarioOuSenhaIncorretaException("A senha digitada está incorreta");
        }
    }


}

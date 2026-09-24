package com.beehub.security;

import com.beehub.exceptions.UsuarioJaExisteException;
import com.beehub.exceptions.UsuarioOuSenhaIncorretaException;
import com.beehub.repository.AlunoRepository;
import com.beehub.repository.ProfessorRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UsuarioValidator {
    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioValidator(AlunoRepository alunoRepository, ProfessorRepository professorRepository,
                            PasswordEncoder passwordEncoder){
        this.alunoRepository = alunoRepository;
        this.professorRepository = professorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void validarRm(Long rm){
        if(alunoRepository.existsByRmAluno(rm) || professorRepository.existsByRmProfessor(rm)){
            throw new UsuarioOuSenhaIncorretaException("Usuário ou senha inválidos!");
        }
    }

    public void validarSenha(String senhaDigitada, String senhaHashBanco){
        boolean senhaValida = passwordEncoder.matches(senhaDigitada, senhaHashBanco);
        if(!senhaValida){
            throw new UsuarioOuSenhaIncorretaException("Usuário ou senha inválidos!");
        }
    }
}

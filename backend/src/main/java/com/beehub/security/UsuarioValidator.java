package com.beehub.security;

import com.beehub.entity.Aluno;
import com.beehub.entity.Grupo;
import com.beehub.entity.Professor;
import com.beehub.exceptions.*;
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

    public void validarAlunoGrupo(Grupo grupo, Long rmAluno){
        Aluno aluno = alunoRepository.findByRmAluno(rmAluno)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Aluno não encontrado!"));

        if(aluno.getGrupo() == null || !aluno.getGrupo().getIdGrupo().equals(grupo.getIdGrupo())){
            throw new AlunoNaoPertenceAoGrupoException("Este aluno não pertence a este grupo!");
        }
    }

    public void validarProfessorGrupo(Grupo grupo, Long rmProfessor){
        if(!grupo.getOrientacao().getProfessor().getRmProfessor().equals(rmProfessor)){
            throw new OrientadorInvalidoException("Você não orienta este grupo!");
        }
    }

    public void validarAcessoAoTcc(Grupo grupo, Long rmUsuario) {
        Aluno buscarAluno = alunoRepository.findByRmAluno(rmUsuario).orElse(null);

        if (buscarAluno != null) {
            validarAlunoGrupo(grupo, rmUsuario);
        }

        Professor buscarProfessor = professorRepository.findByRmProfessor(rmUsuario).orElse(null);

        if (buscarProfessor != null) {
            validarProfessorGrupo(grupo, rmUsuario);
        } else {
            throw new AcessoNaoPermitidoException("Você não tem permissão para fazer isto!");
        }
    }

    public void validarRm(Long rm){
        if(alunoRepository.existsByRmAluno(rm) || professorRepository.existsByRmProfessor(rm)){
            throw new UsuarioOuSenhaIncorretaException("Usuário ou senha inválidos!");
        }
    }

    public void validarSenha(String senhaDigitada, String senhaHashBanco){
        boolean senhaValida = passwordEncoder.matches(senhaDigitada, senhaHashBanco);
        // Mesma exception do rm, para omitir informações à terceiros
        if(!senhaValida){
            throw new UsuarioOuSenhaIncorretaException("Usuário ou senha inválidos!");
        }
    }
}

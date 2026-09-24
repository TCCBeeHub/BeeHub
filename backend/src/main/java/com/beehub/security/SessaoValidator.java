package com.beehub.security;

import com.beehub.exceptions.AcessoNaoPermitidoException;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;

@Component
public class SessaoValidator {
    public static final String ADMINISTRADOR = "ADMINISTRADOR_AUTENTICADO";
    public static final String ALUNO = "ALUNO_AUTENTICADO";
    public static final String PROFESSOR = "PROFESSOR_AUTENTICADO";

    public void validarAdmin(HttpSession session){
        Object adminId = session.getAttribute(ADMINISTRADOR);

        if(adminId == null){
            throw new AcessoNaoPermitidoException("É necessário realizar o login!");
        }
    }

    public void validarAluno(HttpSession session, Long rmAluno){
        Long alunoRM = (Long) session.getAttribute(ALUNO);

        if(alunoRM == null){
            throw new AcessoNaoPermitidoException("É necessário realizar o login!");
        }

        if(!alunoRM.equals(rmAluno)){
            throw new AcessoNaoPermitidoException("Você não tem permissão para fazer isto!");
        }
    }

    public void validarProfessor(HttpSession session, Long rmProfessor){
        Long professorRM = (Long) session.getAttribute(PROFESSOR);

        if(professorRM == null){
            throw new AcessoNaoPermitidoException("É necessário realizar o login!");
        }

        if(!professorRM.equals(rmProfessor)){
            throw new AcessoNaoPermitidoException("Você não tem permissão para fazer isto!");
        }
    }

    public void validarAcessoInterno(HttpSession session){
        if(session.getAttribute(ADMINISTRADOR) == null
        && session.getAttribute(ALUNO) == null
        && session.getAttribute(PROFESSOR) == null){
            throw new AcessoNaoPermitidoException("Acesso restrito a alunos/professores/coordenação");
        }
    }
}

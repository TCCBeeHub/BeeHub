package com.beehub.service;

import com.beehub.dto.request.AlunoLoginRequestDTO;
import com.beehub.dto.request.AlunoRequestDTO;
import com.beehub.entity.Aluno;
import com.beehub.exceptions.*;
import com.beehub.repository.AlunoRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class AlunoService {
    private final AlunoRepository alunoRepository;
    private final PasswordEncoder passwordEncoder;

    public AlunoService(AlunoRepository alunoRepository, PasswordEncoder passwordEncoder){
        this.alunoRepository = alunoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Aluno cadastrarAluno(AlunoRequestDTO dto){
        validarRmAluno(Long.valueOf(dto.rmAluno()));

        Aluno novoAluno = new Aluno();
        novoAluno.setRmAluno(Long.valueOf(dto.rmAluno()));
        novoAluno.setNome(dto.nome());
        novoAluno.setSenha(passwordEncoder.encode(dto.senha()));

        return alunoRepository.save(novoAluno);
    }


    public Aluno loginAluno(AlunoLoginRequestDTO dto){
        Long rm = Long.valueOf(dto.rmAluno());

        Aluno alunoBanco = alunoRepository.findByRmAluno(rm)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Usuário não foi encontrado"));

        validarSenha(dto.senha(), alunoBanco.getSenha());

        return alunoBanco;
    }

    public void excluirAluno(Long rmAluno){
        Aluno deletarAluno = alunoRepository.findByRmAluno(rmAluno)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Não foi encontrado um aluno com este RM!"));

        if(deletarAluno.getGrupo() != null){
            throw new RecursoNaoPermitidoException("Este aluno está inserido em um grupo");
        }

        alunoRepository.delete(deletarAluno);
    }

    private void validarRmAluno(Long rmAluno){
        if(alunoRepository.existsByRmAluno(rmAluno)){
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

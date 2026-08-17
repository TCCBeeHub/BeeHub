package com.beehub.service;

import com.beehub.dto.request.AlunoLoginRequestDTO;
import com.beehub.dto.request.AlunoRequestDTO;
import com.beehub.entity.Aluno;
import com.beehub.exceptions.*;
import com.beehub.repository.AlunoRepository;
import com.beehub.repository.EtecRepository;
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

    private void validarRmAluno(Long rmAluno){
        if(alunoRepository.existsByRmAluno(rmAluno)){
            throw new UsuarioJaExisteException("Este Rm já está sendo usado");
        }
    }

    private void validarSenha(String senhaDigitada, String senhaHashBanco){
        boolean senhaValida = passwordEncoder.matches(senhaDigitada, senhaHashBanco);
        if(!senhaValida){
            throw new SenhaIncorretaException("A senha digitada está incorreta");
        }
    }
}

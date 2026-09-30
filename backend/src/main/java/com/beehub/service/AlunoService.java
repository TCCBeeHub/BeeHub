package com.beehub.service;

import com.beehub.dto.comum.AlunoResumoDTO;
import com.beehub.dto.comum.CursoUsuarioResumoDTO;
import com.beehub.dto.comum.EtecResumoDTO;
import com.beehub.dto.comum.UsuarioResumoDTO;
import com.beehub.dto.request.AlunoLoginRequestDTO;
import com.beehub.dto.request.AlunoRequestDTO;
import com.beehub.dto.response.AlunoResponseDTO;
import com.beehub.dto.update.AlunoRequestAtualizarDTO;
import com.beehub.entity.Aluno;
import com.beehub.entity.Curso;
import com.beehub.exceptions.*;
import com.beehub.repository.AlunoRepository;
import com.beehub.repository.CursoRepository;
import com.beehub.security.UsuarioValidator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class AlunoService {
    private final AlunoRepository alunoRepository;
    private final CursoRepository cursoRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioValidator usuarioValidator;
    private static final String URL_FOTO_PADRAO = "/imagens/foto-sem-perfil.png";

    public AlunoService(AlunoRepository alunoRepository, PasswordEncoder passwordEncoder,
                        CursoRepository cursoRepository, UsuarioValidator usuarioValidator){
        this.alunoRepository = alunoRepository;
        this.cursoRepository = cursoRepository;
        this.usuarioValidator = usuarioValidator;
        this.passwordEncoder = passwordEncoder;
    }

    public AlunoResumoDTO cadastrarAluno(AlunoRequestDTO dto, Long idCurso){
        usuarioValidator.validarRm(dto.rmAluno());

        Curso curso = cursoRepository.findCursoByIdCurso(idCurso)
                .orElseThrow(CursoNaoEncontradoException::new);


        Aluno novoAluno = new Aluno();
        novoAluno.setCurso(curso);
        novoAluno.setRmAluno(dto.rmAluno());
        novoAluno.setNome(dto.nome().trim());
        novoAluno.setSenha(passwordEncoder.encode(dto.senha()));
        novoAluno.setLinkFoto(null);

        Aluno salvarAluno = alunoRepository.save(novoAluno);

        return new AlunoResumoDTO(
                salvarAluno.getRmAluno(),
                salvarAluno.getNome(),
                new CursoUsuarioResumoDTO(
                        curso.getIdCurso(),
                        curso.getNome(),
                        new EtecResumoDTO(
                                curso.getEtec().getCodEtec(),
                                curso.getEtec().getNome()
                        ),
                        curso.getPeriodo()
                ),
                salvarAluno.getLinkFoto()
        );
    }


    public UsuarioResumoDTO loginAluno(AlunoLoginRequestDTO dto){
        Long rm = dto.rmAluno();
        Aluno alunoBanco = alunoRepository.findByRmAluno(rm)
                .orElseThrow(() -> new UsuarioOuSenhaIncorretaException("Usuário ou senha inválidos!"));

        usuarioValidator.validarSenha(dto.senha(), alunoBanco.getSenha());

        return new UsuarioResumoDTO(
                alunoBanco.getRmAluno(),
                alunoBanco.getNome(),
                alunoBanco.getLinkFoto()
        );
    }

    public AlunoResponseDTO atualizarAluno(AlunoRequestAtualizarDTO dto, Long rmAluno){
        Aluno atualizarAluno = alunoRepository.findByRmAluno(rmAluno)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Aluno não encontrado!"));

        String novoEmail = dto.email();
        String novaSenha = dto.novaSenha();
        String novaDescricao = dto.descricao();
        String novaFoto = dto.urlFoto();

        if (novoEmail != null && !novoEmail.isBlank()) {
            novoEmail = novoEmail.trim();

            //comparar email com formatação padrão @ e . (EX: beehub@gmail.com)
            if(!novoEmail.matches("^[\\w._%+-]+@[\\w.-]+\\.[A-Za-z]{2,}$")){
                throw new EmailInvalidoException("Email com formato inválido!");
            }

            if (alunoRepository.existsByEmailIgnoreCaseAndRmAlunoNot(novoEmail, rmAluno)) {
                throw new EmailInvalidoException("Email inválido!");
            }

            atualizarAluno.setEmail(novoEmail);
        }

        if(novaSenha != null && !novaSenha.isBlank()){
            if(passwordEncoder.matches(novaSenha, atualizarAluno.getSenha())){
                throw new SenhaJaUtilizadaException("Você já está utilizando esta senha!");
            }

            atualizarAluno.setSenha(passwordEncoder.encode(novaSenha));
        }

        if(novaDescricao != null && !novaDescricao.isBlank()){
            atualizarAluno.setDescricao(novaDescricao);
        }

        if(novaFoto != null){
            if(novaFoto.isBlank()){
                atualizarAluno.setLinkFoto(URL_FOTO_PADRAO);
            }

            else{
                atualizarAluno.setLinkFoto(novaFoto.trim());
            }
        }

        Aluno alunoAtualizado = alunoRepository.save(atualizarAluno);

        return new AlunoResponseDTO(
                alunoAtualizado.getRmAluno(),
                alunoAtualizado.getNome(),
                alunoAtualizado.getEmail(),
                alunoAtualizado.getDescricao(),
                alunoAtualizado.getCurso().getNome(),
                alunoAtualizado.getLinkFoto()
        );
    }

    public List<UsuarioResumoDTO> listarAlunos(Long idCurso){

        if(!cursoRepository.existsById(idCurso)){
            throw new CursoNaoEncontradoException();
        }

        List<Aluno> alunos = alunoRepository.findAllByCurso_IdCurso(idCurso);

        return alunos.stream()
                .map(aluno -> new UsuarioResumoDTO(
                        aluno.getRmAluno(),
                        aluno.getNome(),
                        aluno.getLinkFoto()
                ))
                .collect(Collectors.toList());
    }

    public AlunoResumoDTO listarAluno(Long rmAluno){
        Aluno aluno = alunoRepository.findByRmAluno(rmAluno)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Aluno não encontrado!"));

        Curso cursoAluno = aluno.getCurso();

        return new AlunoResumoDTO(
                aluno.getRmAluno(),
                aluno.getNome(),
                new CursoUsuarioResumoDTO(
                        cursoAluno.getIdCurso(),
                        cursoAluno.getNome(),
                        new EtecResumoDTO(
                                cursoAluno.getEtec().getCodEtec(),
                                cursoAluno.getEtec().getNome()
                        ),
                        cursoAluno.getPeriodo()
                ),
                aluno.getLinkFoto()
        );
    }

    public void excluirAluno(Long rmAluno){
        Aluno deletarAluno = alunoRepository.findByRmAluno(rmAluno)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Aluno não encontrado!"));

        if(deletarAluno.getGrupo() != null){
            throw new RecursoNaoPermitidoException("Este aluno está inserido em um grupo");
        }

        alunoRepository.delete(deletarAluno);
    }
}

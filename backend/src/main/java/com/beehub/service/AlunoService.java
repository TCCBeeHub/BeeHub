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
import com.beehub.repository.ProfessorRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class AlunoService {
    private final AlunoRepository alunoRepository;
    private final CursoRepository cursoRepository;
    private final ProfessorRepository professorRepository;
    private final PasswordEncoder passwordEncoder;

    public AlunoService(AlunoRepository alunoRepository, PasswordEncoder passwordEncoder,
                        ProfessorRepository professorRepository, CursoRepository cursoRepository){
        this.alunoRepository = alunoRepository;
        this.cursoRepository = cursoRepository;
        this.professorRepository = professorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AlunoResumoDTO cadastrarAluno(AlunoRequestDTO dto, Long idCurso){
        validarRm(dto.rmAluno());

        Curso curso = cursoRepository.findCursoByIdCurso(idCurso)
                .orElseThrow(() -> new CursoNaoEncontradoException("Não existe um curso com esse ID."));


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
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Usuário não foi encontrado"));

        validarSenha(dto.senha(), alunoBanco.getSenha());

        return new UsuarioResumoDTO(
                alunoBanco.getRmAluno(),
                alunoBanco.getNome(),
                alunoBanco.getLinkFoto()
        );
    }

    public AlunoResponseDTO atualizarAluno(AlunoRequestAtualizarDTO dto, Long rmAluno){
        Aluno atualizarAluno = alunoRepository.findByRmAluno(rmAluno)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("O aluno não foi encontrado!"));

        String novoEmail = dto.email();
        String novaSenha = dto.novaSenha();
        String novaDescricao = dto.descricao();
        String novaFoto = dto.urlFoto();

        if (novoEmail != null && !novoEmail.isBlank()) {
            novoEmail = novoEmail.trim();

            if (!alunoRepository.existsByEmailIgnoreCaseAndRmAlunoNot(novoEmail, rmAluno)) {
                atualizarAluno.setEmail(novoEmail);
            }
        }
        if(novaSenha != null && !novaSenha.isBlank()){
            atualizarAluno.setSenha(passwordEncoder.encode(novaSenha));
        }
        if(novaDescricao != null){
            atualizarAluno.setDescricao(novaDescricao);
        }
        if(novaFoto != null){
            atualizarAluno.setLinkFoto(novaFoto);
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

        cursoRepository.findCursoByIdCurso(idCurso)
                .orElseThrow(() -> new CursoNaoEncontradoException(
                        "Não existe um curso com esse ID."
                ));

        List<Aluno> alunos = alunoRepository.findAllByCurso_IdCurso(idCurso);

        return alunos.stream()
                .map(aluno -> new UsuarioResumoDTO(
                        aluno.getRmAluno(),
                        aluno.getNome(),
                        aluno.getEmail()
                        //colocar o nome do curso
                ))
                .collect(Collectors.toList());
    }

    public AlunoResumoDTO listarAluno(Long rmAluno){
        Aluno aluno = alunoRepository.findByRmAluno(rmAluno)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Não existe um aluno com este RM!"));

        Curso cursoAluno = cursoRepository.findCursoByIdCurso(aluno.getCurso().getIdCurso())
                .orElseThrow(() -> new CursoNaoEncontradoException("O curso não foi encontrado"));

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
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Não foi encontrado um aluno com este RM!"));

        if(deletarAluno.getGrupo() != null){
            throw new RecursoNaoPermitidoException("Este aluno está inserido em um grupo");
        }

        alunoRepository.delete(deletarAluno);
    }

    private void validarRm(Long rm){
        if(alunoRepository.existsByRmAluno(rm) || professorRepository.existsByRmProfessor(rm)){
            throw new UsuarioJaExisteException("RM incompatível!");
        }
    }

    private void validarSenha(String senhaDigitada, String senhaHashBanco){
        boolean senhaValida = passwordEncoder.matches(senhaDigitada, senhaHashBanco);
        if(!senhaValida){
            throw new UsuarioOuSenhaIncorretaException("A senha digitada está incorreta");
        }
    }
}

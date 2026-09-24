package com.beehub.service;

import com.beehub.dto.comum.CursoUsuarioResumoDTO;
import com.beehub.dto.comum.EtecResumoDTO;
import com.beehub.dto.comum.ProfessorResumoDTO;
import com.beehub.dto.comum.UsuarioResumoDTO;
import com.beehub.dto.request.ProfessorLoginRequestDTO;
import com.beehub.dto.request.ProfessorRequestDTO;
import com.beehub.dto.response.ProfessorResponseDTO;
import com.beehub.dto.update.ProfessorRequestAtualizarDTO;
import com.beehub.entity.Curso;
import com.beehub.entity.Professor;
import com.beehub.exceptions.*;
import com.beehub.repository.CursoRepository;
import com.beehub.repository.ProfessorRepository;
import com.beehub.security.UsuarioValidator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfessorService {
    private final CursoRepository cursoRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProfessorRepository professorRepository;
    private final UsuarioValidator usuarioValidator;

    public ProfessorService(ProfessorRepository professorRepository, PasswordEncoder passwordEncoder,
                            CursoRepository cursoRepository, UsuarioValidator usuarioValidator){
        this.professorRepository = professorRepository;
        this.passwordEncoder = passwordEncoder;
        this.cursoRepository = cursoRepository;
        this.usuarioValidator = usuarioValidator;
    }

    public ProfessorResumoDTO cadastrarProfessor(ProfessorRequestDTO dto, Long idCurso){
        usuarioValidator.validarRm(dto.rmProfessor());

        Curso curso = cursoRepository.findCursoByIdCurso(idCurso)
                .orElseThrow(CursoNaoEncontradoException::new);

        Professor novoProfessor = new Professor();
        novoProfessor.setCurso(curso);
        novoProfessor.setRmProfessor(dto.rmProfessor());
        novoProfessor.setNome(dto.nome().trim());
        novoProfessor.setSenha(passwordEncoder.encode(dto.senha()));

        Professor salvarProfessor = professorRepository.save(novoProfessor);

        return new ProfessorResumoDTO(
                salvarProfessor.getRmProfessor(),
                salvarProfessor.getNome(),
                new CursoUsuarioResumoDTO(
                        curso.getIdCurso(),
                        curso.getNome(),
                        new EtecResumoDTO(
                          curso.getEtec().getCodEtec(),
                          curso.getEtec().getNome()
                        ),
                        curso.getPeriodo()
                ),
                salvarProfessor.getLinkFoto()
        );
    }


    public UsuarioResumoDTO loginProfessor(ProfessorLoginRequestDTO dto){
        Long rm = dto.rmProfessor();

        Professor professorBanco = professorRepository.findByRmProfessor(rm)
                .orElseThrow(() -> new UsuarioOuSenhaIncorretaException("Usuário ou senha inválidos!"));

        usuarioValidator.validarSenha(dto.senha(), professorBanco.getSenha());

        return new UsuarioResumoDTO(
                professorBanco.getRmProfessor(),
                professorBanco.getNome(),
                professorBanco.getLinkFoto()
        );
    }

    public ProfessorResponseDTO atualizarProfessor(ProfessorRequestAtualizarDTO dto, Long rmProfessor){
        Professor atualizarProfessor = professorRepository.findByRmProfessor(rmProfessor)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Professor não encontrado!"));

        String novoEmail = dto.email();
        String novaSenha = dto.novaSenha();
        String novaDescricao = dto.descricao();
        String novaFotoPerfil = dto.urlFoto();

        if(novoEmail != null && !novoEmail.isBlank()){
            novoEmail = novoEmail.trim();

            if(!novoEmail.matches("^[\\w._%+-]+@[\\w.-]+\\.[A-Za-z]{2,}$")){
                throw new EmailInvalidoException("Email com formato inválido!");
            }

            if(professorRepository.existsByEmailIgnoreCaseAndRmProfessorNot(novoEmail, rmProfessor)){
                throw new EmailInvalidoException("Email inválido!");
            }

            atualizarProfessor.setEmail(novoEmail);
        }

        if(novaSenha != null && !novaSenha.isBlank()){
            atualizarProfessor.setSenha(passwordEncoder.encode(novaSenha));
        }

        if(novaDescricao != null && !novaDescricao.isBlank()){
            atualizarProfessor.setDescricao(novaDescricao);
        }

        if(novaFotoPerfil != null && !novaFotoPerfil.isBlank()){
            atualizarProfessor.setLinkFoto(novaFotoPerfil);
        }

        Professor professorAtualizado = professorRepository.save(atualizarProfessor);

        return new ProfessorResponseDTO(
                professorAtualizado.getRmProfessor(),
                professorAtualizado.getNome(),
                professorAtualizado.getEmail(),
                professorAtualizado.getDescricao(),
                professorAtualizado.getCurso().getNome(),
                professorAtualizado.getLinkFoto()
        );
    }

    public List<UsuarioResumoDTO> listarProfessores(Long idCurso){

        if(!cursoRepository.existsById(idCurso)){
            throw new CursoNaoEncontradoException();
        }

        List<Professor> professores = professorRepository.findAllByCurso_IdCurso(idCurso);

        return professores.stream()
                .map(professor -> new UsuarioResumoDTO(
                        professor.getRmProfessor(),
                        professor.getNome(),
                        professor.getLinkFoto()
                ))
                .collect(Collectors.toList());
    }

    public ProfessorResumoDTO listarProfessor(Long rmProfessor){
        Professor professor = professorRepository.findByRmProfessor(rmProfessor)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Professor não encontrado!"));

        Curso curso = professor.getCurso();

        return new ProfessorResumoDTO(
                professor.getRmProfessor(),
                professor.getNome(),
                new CursoUsuarioResumoDTO(
                  curso.getIdCurso(),
                  curso.getNome(),
                  new EtecResumoDTO(
                          curso.getEtec().getCodEtec(),
                          curso.getEtec().getNome()
                  ),
                  curso.getPeriodo()
                ),
                professor.getLinkFoto()
        );
    }

    public void excluirProfessor(Long rmProfessor){
        Professor deletarProfessor = professorRepository.findByRmProfessor(rmProfessor)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Professor não encontrado!"));

        if(deletarProfessor.getGrupo() != null){
            throw new RecursoNaoPermitidoException("Este professor orienta um grupo!");
        }

        professorRepository.delete(deletarProfessor);
    }
}

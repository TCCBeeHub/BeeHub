package com.beehub.service;

import com.beehub.dto.comum.ProfessorResumoDTO;
import com.beehub.dto.comum.UsuarioResumoDTO;
import com.beehub.dto.request.ProfessorLoginRequestDTO;
import com.beehub.dto.request.ProfessorRequestDTO;
import com.beehub.dto.response.OrientacaoResponseDTO;
import com.beehub.dto.response.ProfessorResponseDTO;
import com.beehub.dto.update.ProfessorRequestAtualizarDTO;
import com.beehub.entity.Orientacao;
import com.beehub.entity.Professor;
import com.beehub.exceptions.*;
import com.beehub.repository.CursoRepository;
import com.beehub.repository.OrientacaoRepository;
import com.beehub.repository.ProfessorRepository;
import com.beehub.security.UsuarioValidator;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfessorService {
    private final CursoRepository cursoRepository;
    private final OrientacaoRepository orientacaoRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProfessorRepository professorRepository;
    private final UsuarioValidator usuarioValidator;
    private static final String URL_FOTO_PADRAO = "/imagens/foto-sem-perfil.png";

    public ProfessorService(ProfessorRepository professorRepository, PasswordEncoder passwordEncoder,
                            CursoRepository cursoRepository, UsuarioValidator usuarioValidator,
                            OrientacaoRepository orientacaoRepository){
        this.professorRepository = professorRepository;
        this.passwordEncoder = passwordEncoder;
        this.cursoRepository = cursoRepository;
        this.orientacaoRepository = orientacaoRepository;
        this.usuarioValidator = usuarioValidator;
    }

    public ProfessorResumoDTO cadastrarProfessor(ProfessorRequestDTO dto){
        usuarioValidator.validarRm(dto.rmProfessor());

        Professor novoProfessor = new Professor();
        novoProfessor.setRmProfessor(dto.rmProfessor());
        novoProfessor.setNome(dto.nome().trim());
        novoProfessor.setSenha(passwordEncoder.encode(dto.senha()));

        Professor salvarProfessor = professorRepository.save(novoProfessor);

        return new ProfessorResumoDTO(
                salvarProfessor.getRmProfessor(),
                salvarProfessor.getNome(),
                List.of(),
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

            //comparar email com formatação padrão @ e . (EX: beehub@gmail.com)
            if(!novoEmail.matches("^[\\w._%+-]+@[\\w.-]+\\.[A-Za-z]{2,}$")){
                throw new EmailInvalidoException("Email com formato inválido!");
            }

            if(professorRepository.existsByEmailIgnoreCaseAndRmProfessorNot(novoEmail, rmProfessor)){
                throw new EmailInvalidoException("Email inválido!");
            }

            atualizarProfessor.setEmail(novoEmail);
        }

        if(novaSenha != null && !novaSenha.isBlank()){
            if(passwordEncoder.matches(novaSenha, atualizarProfessor.getSenha())){
                throw new SenhaJaUtilizadaException("Você já está utilizando esta senha!");
            }
            atualizarProfessor.setSenha(passwordEncoder.encode(novaSenha));
        }

        if(novaDescricao != null && !novaDescricao.isBlank()){
            atualizarProfessor.setDescricao(novaDescricao);
        }

        if(novaFotoPerfil != null){
            if(novaFotoPerfil.isBlank()){
                atualizarProfessor.setLinkFoto(URL_FOTO_PADRAO);
            }

            else{
                atualizarProfessor.setLinkFoto(novaFotoPerfil.trim());
            }
        }

        Professor professorAtualizado = professorRepository.save(atualizarProfessor);

        return new ProfessorResponseDTO(
                professorAtualizado.getRmProfessor(),
                professorAtualizado.getNome(),
                professorAtualizado.getEmail(),
                professorAtualizado.getDescricao(),
                professorAtualizado.getLinkFoto()
        );
    }

    @Transactional(readOnly = true)
    public List<UsuarioResumoDTO> listarProfessores(Long idCurso){

        if(!cursoRepository.existsById(idCurso)){
            throw new CursoNaoEncontradoException();
        }

        List<Orientacao> orientacoes = orientacaoRepository.findAllByCurso_IdCurso(idCurso);

        return orientacoes.stream()
                .map(o -> new UsuarioResumoDTO(
                        o.getProfessor().getRmProfessor(),
                        o.getProfessor().getNome(),
                        o.getProfessor().getLinkFoto()
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProfessorResumoDTO listarProfessor(Long rmProfessor){
        Professor professor = professorRepository.findByRmProfessor(rmProfessor)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Professor não encontrado!"));

        List<Orientacao> orientacoes = orientacaoRepository.findAllByProfessor_RmProfessor(rmProfessor);

        List<OrientacaoResponseDTO> dtos = orientacoes.stream()
                .map(o -> new OrientacaoResponseDTO(
                        o.getCurso().getNome(),
                        o.getCurso().getEtec().getNome(),
                        o.getGrupoOrientacao()
                ))
                .toList();

        return new ProfessorResumoDTO(
                professor.getRmProfessor(),
                professor.getNome(),
                dtos,
                professor.getLinkFoto()
        );
    }

    @Transactional
    public void excluirProfessor(Long rmProfessor){
        Professor deletarProfessor = professorRepository.findByRmProfessor(rmProfessor)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Professor não encontrado!"));

        if(!deletarProfessor.getOrientacoes().isEmpty()){
            throw new RecursoNaoPermitidoException("Este professor orienta um grupo!");
        }

        professorRepository.delete(deletarProfessor);
    }
}

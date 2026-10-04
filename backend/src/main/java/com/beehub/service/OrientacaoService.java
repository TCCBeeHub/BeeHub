package com.beehub.service;

import com.beehub.dto.request.OrientacaoRequestDTO;
import com.beehub.dto.response.OrientacaoResponseDTO;
import com.beehub.entity.Curso;
import com.beehub.entity.Orientacao;
import com.beehub.entity.Professor;
import com.beehub.exceptions.*;
import com.beehub.repository.CursoRepository;
import com.beehub.repository.OrientacaoRepository;
import com.beehub.repository.ProfessorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrientacaoService {
    private final CursoRepository cursoRepository;
    private final OrientacaoRepository orientacaoRepository;
    private final ProfessorRepository professorRepository;

    public OrientacaoService(CursoRepository cursoRepository ,OrientacaoRepository orientacaoRepository,
                             ProfessorRepository professorRepository) {
        this.cursoRepository = cursoRepository;
        this.orientacaoRepository = orientacaoRepository;
        this.professorRepository = professorRepository;
    }

    @Transactional
    public OrientacaoResponseDTO cadastrarOrientacao(OrientacaoRequestDTO dto){
        Professor encontrarProfessor = professorRepository.findByRmProfessor(dto.rmProfessor())
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Usuário não encontrado!"));

        Curso buscarCurso = cursoRepository.findCursoByIdCurso(dto.idCurso())
                .orElseThrow(() -> new CursoNaoEncontradoException("Curso não encontrado!"));

        if(orientacaoRepository.existsByCurso_IdCursoAndGrupoOrientacao(dto.idCurso(), dto.grupo())){
            throw new OrientacaoJaEncontradaException("Este grupo já está sendo orientado.");
        }

        if(orientacaoRepository.existsByProfessor_RmProfessorAndCurso_IdCurso(encontrarProfessor.getRmProfessor(), buscarCurso.getIdCurso())){
            throw new ProfessorJaOrientaException("O professor já orienta um curso!");
        }

        Orientacao novaOrientacao = new Orientacao();
        novaOrientacao.setCurso(buscarCurso);
        novaOrientacao.setProfessor(encontrarProfessor);
        novaOrientacao.setGrupoOrientacao(dto.grupo());

        Orientacao salvarOrientacao = orientacaoRepository.save(novaOrientacao);

        return new OrientacaoResponseDTO(
                salvarOrientacao.getCurso().getNome(),
                salvarOrientacao.getCurso().getEtec().getNome(),
                salvarOrientacao.getGrupoOrientacao()
        );
    }

    @Transactional(readOnly = true)
    public List<OrientacaoResponseDTO> listarOrientacoes(Long rmProfessor){
        if(!professorRepository.existsByRmProfessor(rmProfessor)){
            throw new UsuarioNaoEncontradoException("O rm deste professor não existe!");
        }

        List<Orientacao> orientacaos = orientacaoRepository.findAllByProfessor_RmProfessor(rmProfessor);

        return orientacaos.stream()
                .map(orientacao -> new OrientacaoResponseDTO(
                        orientacao.getCurso().getNome(),
                        orientacao.getCurso().getEtec().getNome(),
                        orientacao.getGrupoOrientacao()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void excluirOrientacao(Long rmProfessor, Long idCurso){
        Orientacao buscarOrientacao = orientacaoRepository
                .findByProfessor_RmProfessorAndCurso_IdCurso(rmProfessor, idCurso)
                .orElseThrow(() -> new OrientacaoNaoEncontradaException("Orientação inválida!"));

        if(!buscarOrientacao.getGrupos().isEmpty()){
            throw new RecursoNaoPermitidoException("O professor orienta grupos!");
        }

        orientacaoRepository.delete(buscarOrientacao);
    }
}

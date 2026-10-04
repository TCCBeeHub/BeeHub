package com.beehub.repository;

import com.beehub.entity.Orientacao;
import com.beehub.enums.GrupoOrientacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrientacaoRepository extends JpaRepository<Orientacao, Long> {
    boolean existsByCurso_IdCursoAndGrupoOrientacao(Long idCurso, GrupoOrientacao grupoOrientacao);
    boolean existsByProfessor_RmProfessorAndCurso_IdCurso(Long rmProfessor, Long idCurso);
    List<Orientacao> findAllByCurso_IdCurso(Long idCurso);
    List<Orientacao> findAllByProfessor_RmProfessor(Long rmProfessor);
    Optional<Orientacao> findByProfessor_RmProfessorAndCurso_IdCurso(Long rmProfessor, Long idCurso);
    Optional<Orientacao> findOrientacaoByIdOrientacao(Long idOrientacao);
}

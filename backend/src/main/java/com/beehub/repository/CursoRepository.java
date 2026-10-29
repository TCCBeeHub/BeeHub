package com.beehub.repository;

import com.beehub.entity.Curso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CursoRepository extends JpaRepository<Curso, Long> {
    boolean existsByNomeAndEtec_CodEtecAndPeriodo(String nome, String codEtec, String periodo);
    List<Curso> findAllByEtec_CodEtec(String codEtec);
    Optional<Curso> findCursoByIdCursoAndEtec_CodEtec(Long idCurso, String etecCodEtec);
    boolean existsByNomeAndEtec_CodEtecAndIdCursoNotAndPeriodo(String nome, String codEtec, Long idCurso, String periodo);
    Optional<Curso> findCursoByIdCurso(Long idCurso);
}

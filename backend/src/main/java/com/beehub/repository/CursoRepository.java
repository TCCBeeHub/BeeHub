package com.beehub.repository;

import com.beehub.dto.response.CursoResponseDTO;
import com.beehub.entity.Curso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CursoRepository extends JpaRepository<Curso, Long> {
    boolean existsCursoByIdCurso(Long idCurso);
    boolean existsByNome(String nome);
    Optional<CursoResponseDTO> findResumoByIdCurso(Long idCurso);
}

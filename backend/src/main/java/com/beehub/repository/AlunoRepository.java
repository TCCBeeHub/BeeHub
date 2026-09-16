package com.beehub.repository;

import com.beehub.entity.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    Optional<Aluno> findByRmAluno(Long rmAluno);
    boolean existsByRmAluno(Long rmAluno);
    boolean existsByEmailIgnoreCaseAndRmAlunoNot(String email, Long rmAluno);
    List<Aluno> findAllByCurso_IdCurso(Long idCurso);
    Long countAlunoByCurso_IdCurso(Long cursoIdCurso);
}

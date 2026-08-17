package com.beehub.repository;

import com.beehub.entity.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    Optional<Aluno> findByRmAluno(Long rmAluno);
    boolean existsByRmAluno(Long rmAluno);
}

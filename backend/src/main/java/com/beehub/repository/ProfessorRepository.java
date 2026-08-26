package com.beehub.repository;

import com.beehub.entity.Professor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    boolean existsByRmProfessor(Long rmProfessor);
    Optional<Professor> findByRmProfessor(Long rmProfessor);
}

package com.beehub.repository;

import com.beehub.entity.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    //métodos se forem necessários para busca, etc
}

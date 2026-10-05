package com.beehub.repository;

import com.beehub.entity.Tcc;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TccRepository extends JpaRepository<Tcc, Long> {
    boolean existsByTemaIgnoreCase(String tema);
    Optional<Tcc> findByGrupo_IdGrupo(Long idGrupo);
}

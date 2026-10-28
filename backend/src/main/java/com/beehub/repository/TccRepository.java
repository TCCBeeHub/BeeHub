package com.beehub.repository;

import com.beehub.entity.Tcc;
import com.beehub.enums.StatusTcc;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TccRepository extends JpaRepository<Tcc, Long> {
    boolean existsByTemaIgnoreCase(String tema);
    Optional<Tcc> findByCodTcc(Long codTcc);
    Optional<Tcc> findByGrupo_IdGrupo(Long idGrupo);
    List<Tcc> findAllByStatus(StatusTcc status);
}

package com.beehub.repository;

import com.beehub.entity.Etec;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EtecRepository extends JpaRepository<Etec, Long> {
    boolean existsByCodEtec(String codEtec);
    boolean existsEtecByNomeIgnoreCase(String nomeEtec);
    boolean existsByNomeIgnoreCaseAndCodEtecNot(String nome, String codEtec);
    Optional<Etec> findEtecByCodEtec(String codEtec);
}

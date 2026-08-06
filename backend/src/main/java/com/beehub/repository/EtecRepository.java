package com.beehub.repository;

import com.beehub.dto.EtecResumoDTO;
import com.beehub.entity.Etec;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EtecRepository extends JpaRepository<Etec, Long> {
    boolean existsByCodEtec(String codEtec);
    boolean existsByNome(String nome);
    boolean findByCodEtec(String codEtec);
    EtecResumoDTO findEtecByCodEtec(String codEtec);
}

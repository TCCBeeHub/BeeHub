package com.beehub.repository;

import com.beehub.entity.MensagemGrupo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MensagemGrupoRepository extends JpaRepository<MensagemGrupo, Long> {
    List<MensagemGrupo> findTop100ByGrupo_IdGrupoOrderByEnviadaEmDesc(Long idGrupo);
}

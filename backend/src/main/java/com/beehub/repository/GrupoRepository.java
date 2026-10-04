package com.beehub.repository;

import com.beehub.entity.Grupo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface GrupoRepository extends JpaRepository<Grupo, Long> {
    boolean existsByNomeGrupoIgnoreCase(String nomeGrupo);
    Optional<Grupo> findByIdGrupo(Long idGrupo);
    boolean existsByNomeGrupoIgnoreCaseAndIdGrupoNot(String nomeGrupo, Long idGrupo);

    @Query("SELECT g FROM Grupo g " +
            "WHERE (:ano IS NULL or g.ano = :ano) AND " +
            "(:idCurso IS NULL OR g.orientacao.curso.idCurso = :idCurso)")
    List<Grupo> findByFiltros(@Param("ano") Integer ano,
                              @Param("idCurso") Long idCurso);
}

package com.beehub.repository;

import com.beehub.entity.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdministradorRepository extends JpaRepository<Administrador, Long> {
    boolean existsByUser(String user);
    Optional<Administrador> findAdministradorsByIdAdmin(Long idAdmin);
}

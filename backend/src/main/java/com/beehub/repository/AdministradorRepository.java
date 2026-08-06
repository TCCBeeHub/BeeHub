package com.beehub.repository;

import com.beehub.entity.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdministradorRepository extends JpaRepository<Administrador, Long> {
    boolean existsByUser(String user);
    boolean findAdministradorsByIdAdmin(Long idAdmin);
}

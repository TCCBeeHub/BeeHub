package com.beehub.dto.response;

public record AdministradorResponseDTO(
    Long idAdmin,
    String user,
    String mensagemConfirmacao
) {}

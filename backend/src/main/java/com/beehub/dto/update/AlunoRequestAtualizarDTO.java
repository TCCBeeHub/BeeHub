package com.beehub.dto.update;

import jakarta.validation.constraints.Email;

public record AlunoRequestAtualizarDTO(
    @Email(message = "Formato de email inválido")
    String email,
    String novaSenha,
    String descricao,
    String urlFoto
) {}

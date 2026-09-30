package com.beehub.dto.update;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record AlunoRequestAtualizarDTO(
    @Email(message = "Formato de email inválido")
    String email,
    @Size(min=6, max = 20, message = "A senha deve conter entre 6 a 20 caracteres")
    String novaSenha,
    String descricao,
    String urlFoto
) {}

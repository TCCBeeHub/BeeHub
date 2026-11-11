package com.beehub.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MensagemGrupoRequestDTO(
        @NotBlank(message = "A mensagem não pode estar vazia")
        @Size(max = 1000, message = "A mensagem deve ter no máximo 1000 caracteres")
        String conteudo
) {
}

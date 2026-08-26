package com.beehub.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EtecRequestDTO(
    @NotBlank(message = "A etec requer um código.")
    @Pattern(regexp = ("\\d{3}"), message = "O código precisa ter 3 números.")
    String codEtec,

    @NotBlank(message = "Por favor insira o nome da Etec")
    @Size(min = 10, max = 100, message = "Tamanho não coerente com o determinado 10-100 caracteres!")
    String nome
) {}

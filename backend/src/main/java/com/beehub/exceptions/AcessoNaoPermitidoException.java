package com.beehub.exceptions;

public class AcessoNaoPermitidoException extends RuntimeException {
    public AcessoNaoPermitidoException(String message) {
        super(message);
    }
}

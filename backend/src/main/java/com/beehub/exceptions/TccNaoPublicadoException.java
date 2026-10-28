package com.beehub.exceptions;

public class TccNaoPublicadoException extends AcessoNaoPermitidoException {
    public TccNaoPublicadoException(String message) {
        super(message);
    }
}

package com.beehub.exceptions;

public class TccNaoFoiEntregueException extends RecursoNaoPermitidoException {
    public TccNaoFoiEntregueException(String message) {
        super(message);
    }
}

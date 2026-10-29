package com.beehub.exceptions;

public class SenhaIncorretaException extends RecursoNaoPermitidoException {
    public SenhaIncorretaException(String message) {
        super(message);
    }
}

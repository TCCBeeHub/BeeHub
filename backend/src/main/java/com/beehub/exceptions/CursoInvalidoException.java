package com.beehub.exceptions;

public class CursoInvalidoException extends RecursoNaoPermitidoException {
    public CursoInvalidoException(String message) {
        super(message);
    }
}

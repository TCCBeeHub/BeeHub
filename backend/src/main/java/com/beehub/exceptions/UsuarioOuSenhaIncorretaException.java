package com.beehub.exceptions;

public class UsuarioOuSenhaIncorretaException extends RecursoNaoPermitidoException {
    public UsuarioOuSenhaIncorretaException(String message) {
        super(message);
    }
}

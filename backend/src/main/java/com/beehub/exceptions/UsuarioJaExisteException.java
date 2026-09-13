package com.beehub.exceptions;

public class UsuarioJaExisteException extends RecursoJaEncontradoException {
    public UsuarioJaExisteException(String message) {
        super(message);
    }
}

package com.beehub.exceptions;

public class UsuarioOuSenhaIncorretaException extends RuntimeException {
    public UsuarioOuSenhaIncorretaException(String message) {
        super(message);
    }
}

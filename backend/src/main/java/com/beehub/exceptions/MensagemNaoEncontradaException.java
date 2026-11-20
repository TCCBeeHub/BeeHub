package com.beehub.exceptions;

public class MensagemNaoEncontradaException extends RecursoNaoEncontradoException {
    public MensagemNaoEncontradaException(String message) {
        super(message);
    }
}

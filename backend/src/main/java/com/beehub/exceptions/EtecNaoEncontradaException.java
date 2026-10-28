package com.beehub.exceptions;

public class EtecNaoEncontradaException extends RecursoNaoEncontradoException {
    private static final String MENSAGEM = "Etec não encontrada";

    public EtecNaoEncontradaException(){
        super(MENSAGEM);
    }

    public EtecNaoEncontradaException(String message) {
        super(message);
    }
}

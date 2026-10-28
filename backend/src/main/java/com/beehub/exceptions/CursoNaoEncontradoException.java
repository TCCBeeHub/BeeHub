package com.beehub.exceptions;

public class CursoNaoEncontradoException extends RecursoNaoEncontradoException {
    private static final String mensagem = "Curso não encontrado";
    public CursoNaoEncontradoException() {
        super(mensagem);
    }

    public CursoNaoEncontradoException(String message){
        super(message);
    }
}

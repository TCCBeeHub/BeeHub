package com.beehub.exceptions;

public class GrupoNomeJaUtilizadoException extends RecursoJaEncontradoException {
    private static String MESSAGE = "Nome de grupo já utilizado no sistema!";

    public GrupoNomeJaUtilizadoException(){
        super(MESSAGE);
    }

    public GrupoNomeJaUtilizadoException(String message) {
        super(message);
    }
}

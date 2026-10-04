package com.beehub.exceptions;

public class AnoInvalidoException extends RuntimeException {
    private static String MESSAGE = "Ano digitado inválido";

    public AnoInvalidoException(){ super(MESSAGE); }

    public AnoInvalidoException(String message) {
        super(message);
    }
}

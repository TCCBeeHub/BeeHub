package com.beehub.handler;

import com.beehub.exceptions.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UsuarioOuSenhaIncorretaException.class)
    public ResponseEntity<String> handleUsuarioOuSenhaInvalidos(UsuarioOuSenhaIncorretaException ex){
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AcessoNaoPermitidoException.class)
    public ResponseEntity<String> handleAcessoNaoPermitido(AcessoNaoPermitidoException ex){
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(RecursoJaEncontradoException.class)
    public ResponseEntity<String> handleAtributoJaEncontrado(RecursoJaEncontradoException ex){
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<String> handleAtributoNaoEncontrado(RecursoNaoEncontradoException ex){
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
}

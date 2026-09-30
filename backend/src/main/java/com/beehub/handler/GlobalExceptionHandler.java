package com.beehub.handler;

import com.beehub.exceptions.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    /*
    * Handler Global das exceptions, onde subclasses que herdam de alguma das exceptions abaixo
    * são tratadas aqui mantendo sua prioridade.
    *
    * Objetivo: Manter um código limpo apenas passando a mensagem o status HTTP
    * */
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

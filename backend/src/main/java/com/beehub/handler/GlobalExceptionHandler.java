package com.beehub.handler;

import com.beehub.exceptions.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    /*
     * Handler Global das exceptions, onde subclasses que herdam de alguma das exceptions abaixo
     * são tratadas aqui mantendo sua prioridade.
     *
     * Objetivo: Manter um código limpo apenas passando a mensagem o status HTTP
     * */
    @ExceptionHandler(UsuarioOuSenhaIncorretaException.class)
    public ResponseEntity<Map<String, Object>> handleUsuarioOuSenhaInvalidos(UsuarioOuSenhaIncorretaException ex){
        return buildErrorResponse(ex.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AcessoNaoPermitidoException.class)
    public ResponseEntity<Map<String, Object>> handleAcessoNaoPermitido(AcessoNaoPermitidoException ex){
        return buildErrorResponse(ex.getMessage(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(RecursoNaoPermitidoException.class)
    public ResponseEntity<Map<String, Object>> handleAcessoNaoPermitido(RecursoNaoPermitidoException ex){
        return buildErrorResponse(ex.getMessage(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(RecursoJaEncontradoException.class)
    public ResponseEntity<Map<String, Object>> handleAtributoJaEncontrado(RecursoJaEncontradoException ex){
        return buildErrorResponse(ex.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<Map<String, Object>> handleAtributoNaoEncontrado(RecursoNaoEncontradoException ex){
        return buildErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleErroGenerico(Exception ex) {
        return buildErrorResponse("Ocorreu um erro interno no servidor.", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Método auxiliar para montar o JSON de erro
    private ResponseEntity<Map<String, Object>> buildErrorResponse(String message, HttpStatus status) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return new ResponseEntity<>(body, status);
    }
}

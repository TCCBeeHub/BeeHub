package com.beehub.service;

import com.beehub.dto.EtecResumoDTO;
import com.beehub.entity.Etec;
import com.beehub.exceptions.RecursoJaEncontradoException;
import com.beehub.exceptions.RecursoNaoEncontradoException;
import com.beehub.repository.EtecRepository;
import org.springframework.stereotype.Service;

@Service
public class EtecService {
    private final EtecRepository etecRepository;
    public EtecService(EtecRepository etecRepository){
        this.etecRepository = etecRepository;
    }

    public Etec cadastrarEtec(Etec etec){
        validarCodigoEtecExistente(etec);
        validarNomeEtec(etec);
        return etecRepository.save(etec);
    }

    public Etec atualizarEtec(Etec etec){
        validarCodigoEtecNaoExistente(etec);
        validarNomeEtec(etec);
        return etecRepository.save(etec);
    }

    public EtecResumoDTO listarEtec(String codEtec){
        validarCodigoEtecNaoExistente(codEtec);
        return etecRepository.findEtecByCodEtec(codEtec);
    }

    private void validarCodigoEtecNaoExistente(Etec etec){
        if(!etecRepository.existsByCodEtec(etec.getCodEtec())){
            throw new RecursoNaoEncontradoException("A Etec digitada não existe");
        }
    }

    private void validarCodigoEtecNaoExistente(String codEtec){
        if(!etecRepository.existsByCodEtec(codEtec)){
            throw new RecursoNaoEncontradoException("A Etec digitada não existe");
        }
    }

    private void validarCodigoEtecExistente(Etec etec){
        if(etecRepository.existsByCodEtec(etec.getCodEtec())){
            throw new RecursoJaEncontradoException("O código " + etec.getCodEtec() + " " +
                    "pertence a outra Etec");
        }
    }

    private void validarNomeEtec(Etec etec){
        if(etecRepository.existsByNome(etec.getNome())){
            throw new RecursoJaEncontradoException("Uma Etec já possui este nome");
        }
    }
}

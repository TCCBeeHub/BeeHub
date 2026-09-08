package com.beehub.service;

import com.beehub.dto.comum.EtecResumoDTO;
import com.beehub.dto.request.EtecRequestDTO;
import com.beehub.dto.update.EtecRequestAtualizarDTO;
import com.beehub.entity.Etec;
import com.beehub.exceptions.*;
import com.beehub.repository.EtecRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EtecService {
    private final EtecRepository etecRepository;
    public EtecService(EtecRepository etecRepository){
        this.etecRepository = etecRepository;
    }

    public EtecResumoDTO cadastrarEtec(EtecRequestDTO dto){
        String codEtec = dto.codEtec().trim();
        String nomeEtec = dto.nome().trim();

        validarCodigoEtecExistente(codEtec);
        validarNomeEtec(nomeEtec);

        Etec novaEtec = new Etec();

        novaEtec.setCodEtec(codEtec);
        novaEtec.setNome(nomeEtec);

        Etec etec = etecRepository.save(novaEtec);

        return new EtecResumoDTO(
                etec.getCodEtec(),
                etec.getNome()
        );
    }

    public EtecResumoDTO atualizarEtec(String codEtec, EtecRequestAtualizarDTO dto){
        Etec atualizarNomeEtec = etecRepository.findEtecByCodEtec(codEtec)
                .orElseThrow(() -> new EtecNaoEncontradaException("A Etec solicitada não existe!"));

        String novoNome = dto.nome().trim();

        if(etecRepository.existsByNomeIgnoreCaseAndCodEtecNot(novoNome, codEtec)){
            throw new EtecJaEncontradaException("Uma Etec já possui este nome");
        }

        atualizarNomeEtec.setNome(novoNome);

        Etec atualizacaoEtec = etecRepository.save(atualizarNomeEtec);

        return new EtecResumoDTO(
                atualizacaoEtec.getCodEtec(),
                atualizacaoEtec.getNome()
        );
    }

    public void excluirEtec(String codEtec){
        Etec deletarEtec = etecRepository.findEtecByCodEtec(codEtec)
                .orElseThrow(() -> new EtecNaoEncontradaException("A Etec solicitada não existe!"));

        if(!deletarEtec.getCursos().isEmpty()){
            throw new RecursoNaoPermitidoException("Uma Etec não pode ser excluída contendo cursos!");
        }

        etecRepository.delete(deletarEtec);
    }


    public EtecResumoDTO listarEtec(String codEtec){
        return etecRepository.findResumoByCodEtec(codEtec).orElseThrow(() -> new EtecNaoEncontradaException("Etec não encontrada!"));
    }

    public List<EtecResumoDTO> listarEtecs(){
        List<Etec> etecs = etecRepository.findAll();

        return etecs.stream()
                .map(etec -> new EtecResumoDTO(etec.getCodEtec(), etec.getNome()))
                .collect(Collectors.toList());
    }

    private void validarCodigoEtecExistente(String codEtec){
        if(etecRepository.existsByCodEtec(codEtec)){
            throw new EtecJaEncontradaException("O código " + codEtec + " " +
                    "pertence a outra Etec");
        }
    }

    private void validarNomeEtec(String nomeEtec){
        if(etecRepository.existsEtecByNomeIgnoreCase(nomeEtec)){
            throw new EtecJaEncontradaException("Uma Etec já possui este nome");
        }
    }
}

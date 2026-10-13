package com.beehub.service;

import com.beehub.dto.comum.CursoResumoDTO;
import com.beehub.dto.comum.EtecResumoDTO;
import com.beehub.dto.request.EtecRequestDTO;
import com.beehub.dto.response.EtecResponseDTO;
import com.beehub.dto.update.EtecRequestAtualizarDTO;
import com.beehub.entity.Etec;
import com.beehub.exceptions.*;
import com.beehub.repository.EtecRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EtecService {
    private final EtecRepository etecRepository;
    public EtecService(EtecRepository etecRepository){
        this.etecRepository = etecRepository;
    }

    @Transactional
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

    @Transactional
    public EtecResumoDTO atualizarEtec(String codEtec, EtecRequestAtualizarDTO dto){
        Etec atualizarNomeEtec = etecRepository.findEtecByCodEtec(codEtec)
                .orElseThrow(EtecNaoEncontradaException::new);

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

    @Transactional(readOnly = true)
    public EtecResumoDTO listarEtec(String codEtec){
        Etec etec = etecRepository.findEtecByCodEtec(codEtec)
                .orElseThrow(EtecNaoEncontradaException::new);

        return new EtecResumoDTO(
                etec.getCodEtec(),
                etec.getNome()
        );
    }

    @Transactional(readOnly = true)
    public EtecResponseDTO listarEtecComCursos(String codEtec){
        Etec buscarEtec = etecRepository.findEtecByCodEtec(codEtec)
                .orElseThrow(EtecNaoEncontradaException::new);

        List<CursoResumoDTO> cursos = buscarEtec.getCursos().stream()
                .map(c -> new CursoResumoDTO(
                        c.getIdCurso(),
                        c.getEtec().getCodEtec(),
                        c.getNome(),
                        c.getPeriodo()
                ))
                .toList();

        return new EtecResponseDTO(
                buscarEtec.getCodEtec(),
                buscarEtec.getNome(),
                cursos
        );
    }

    @Transactional(readOnly = true)
    public List<EtecResumoDTO> listarEtecs(){
        List<Etec> etecs = etecRepository.findAll();

        return etecs.stream()
                .map(etec -> new EtecResumoDTO(etec.getCodEtec(), etec.getNome()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void excluirEtec(String codEtec){
        Etec deletarEtec = etecRepository.findEtecByCodEtec(codEtec)
                .orElseThrow(EtecNaoEncontradaException::new);

        if(!deletarEtec.getCursos().isEmpty()){
            throw new RecursoNaoPermitidoException("Uma Etec não pode ser excluída contendo cursos!");
        }

        etecRepository.delete(deletarEtec);
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

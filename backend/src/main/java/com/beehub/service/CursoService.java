package com.beehub.service;

import com.beehub.dto.request.CursoRequestDTO;
import com.beehub.dto.response.CursoResponseDTO;
import com.beehub.entity.Curso;
import com.beehub.entity.Etec;
import com.beehub.exceptions.*;
import com.beehub.repository.CursoRepository;
import com.beehub.repository.EtecRepository;
import org.springframework.stereotype.Service;

@Service
public class CursoService {
    private final CursoRepository cursoRepository;
    private final EtecRepository etecRepository;

    public CursoService(CursoRepository cursoRepository, EtecRepository etecRepository){
        this.cursoRepository = cursoRepository;
        this.etecRepository = etecRepository;
    }

    public Curso cadastrarCurso(CursoRequestDTO dto){
        validarCurso(dto.nome());

        Etec codEtec = etecRepository.findEtecByCodEtec(dto.codEtec())
                .orElseThrow(() -> new EtecNaoEncontradaException("ETEC não encontrada!"));

        Curso novoCurso = new Curso();
        novoCurso.setEtec(codEtec);
        novoCurso.setNome(dto.nome());
        novoCurso.setPeriodo(dto.periodo());

        return cursoRepository.save(novoCurso);
    }

    public Curso atualizarCurso(Curso curso){
        validarCursoNaoExistente(curso.getIdCurso());
        return cursoRepository.save(curso);
    }

    public CursoResponseDTO listarCurso(Curso curso){
        return cursoRepository.findResumoByIdCurso(curso.getIdCurso())
                .orElseThrow(() -> new UsuarioNaoEncontradoException("O curso não foi encontrado!"));
    }

    public void excluirCurso(Curso curso){
        validarCursoNaoExistente(curso.getIdCurso());
        cursoRepository.delete(curso);
    }

    public void validarCurso(String nome) {
        if (cursoRepository.existsByNome(nome)) {
            throw new RecursoJaEncontradoException("Esse curso já existe nesta Etec");
        }
    }

    private void validarCursoNaoExistente(Long idCurso){
        if(!cursoRepository.existsCursoByIdCurso(idCurso)){
            throw new CursoNaoEncontradoException("O curso solicitado não existe");
        }
    }
}

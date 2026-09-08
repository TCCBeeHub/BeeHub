package com.beehub.service;

import com.beehub.dto.comum.CursoResumoDTO;
import com.beehub.dto.request.CursoRequestDTO;
import com.beehub.dto.response.CursoResponseDTO;
import com.beehub.dto.update.CursoRequestAtualizarDTO;
import com.beehub.entity.Curso;
import com.beehub.entity.Etec;
import com.beehub.exceptions.*;
import com.beehub.repository.AlunoRepository;
import com.beehub.repository.CursoRepository;
import com.beehub.repository.EtecRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CursoService {
    private final CursoRepository cursoRepository;
    private final EtecRepository etecRepository;
    private final AlunoRepository alunoRepository;

    public CursoService(CursoRepository cursoRepository, EtecRepository etecRepository,
                        AlunoRepository alunoRepository){
        this.cursoRepository = cursoRepository;
        this.etecRepository = etecRepository;
        this.alunoRepository = alunoRepository;
    }

    public CursoResumoDTO cadastrarCurso(CursoRequestDTO dto){
        String codEtec = dto.codEtec().trim();
        String nomeCurso = dto.nome().trim();
        String periodoCurso = dto.periodo().trim();

        Etec etec = etecRepository.findEtecByCodEtec(codEtec)
                .orElseThrow(() -> new EtecNaoEncontradaException("ETEC não encontrada!"));

        validarCurso(new CursoRequestDTO(
                codEtec,
                nomeCurso,
                periodoCurso
        ));

        Curso novoCurso = new Curso();

        novoCurso.setEtec(etec);
        novoCurso.setNome(nomeCurso);
        novoCurso.setPeriodo(periodoCurso);

        Curso curso = cursoRepository.save(novoCurso);

        return new CursoResumoDTO(
                curso.getIdCurso(),
                curso.getEtec().getCodEtec(),
                curso.getNome(),
                curso.getPeriodo()
        );
    }

    public CursoResumoDTO atualizarCurso(Long idCurso, String codEtec, CursoRequestAtualizarDTO dto){
        String codEtecNormalizado = codEtec.trim();

        validarCodEtec(codEtecNormalizado);

        Curso atualizarInfoCurso = cursoRepository.findCursoByIdCursoAndEtec_CodEtec(idCurso, codEtecNormalizado)
                .orElseThrow(() -> new CursoNaoEncontradoException("O curso não foi encontrado"));

        String novoNome = dto.nome().trim();
        String novoPeriodo = dto.periodo().trim();

        if(cursoRepository.existsByNomeAndEtec_CodEtecAndIdCursoNotAndPeriodo
                (novoNome, codEtecNormalizado, idCurso, novoPeriodo)){
            throw new CursoJaEncontradoException("Já existe um curso com este nome na etec " + atualizarInfoCurso.getEtec().getCodEtec());
        }

        atualizarInfoCurso.setNome(novoNome);
        atualizarInfoCurso.setPeriodo(novoPeriodo);

        Curso atualizacaoCurso = cursoRepository.save(atualizarInfoCurso);

        return new CursoResumoDTO(
                atualizacaoCurso.getIdCurso(),
                atualizacaoCurso.getEtec().getCodEtec(),
                atualizacaoCurso.getNome(),
                atualizacaoCurso.getPeriodo()
        );
    }

    public CursoResponseDTO listarCurso(Long idCurso, String codEtec){
        String codEtecNormalizado = codEtec.trim();
        validarCodEtec(codEtecNormalizado);

        Curso curso = cursoRepository.findCursoByIdCursoAndEtec_CodEtec(idCurso, codEtecNormalizado)
                .orElseThrow(() -> new CursoNaoEncontradoException("O id deste curso não foi encontrado nesta etec."));

        return new CursoResponseDTO(
            curso.getIdCurso(),
            curso.getEtec().getCodEtec(), curso.getNome(),
            alunoRepository.countAlunoByCurso_IdCurso(curso.getIdCurso()),
            curso.getPeriodo()
        );
    }

    public List<CursoResponseDTO> listarCursos(String codEtec){
        String codEtecNormalizado = codEtec.trim();
        validarCodEtec(codEtecNormalizado);

        List<Curso> cursos = cursoRepository.findAllByEtec_CodEtec(codEtecNormalizado);

        return cursos.stream()
                .map(curso -> new CursoResponseDTO(curso.getIdCurso(),
                        curso.getEtec().getCodEtec().trim(), curso.getNome(),
                        alunoRepository.countAlunoByCurso_IdCurso(curso.getIdCurso()),
                        curso.getPeriodo()))
                .collect(Collectors.toList());
    }

    public void excluirCurso(Long idCurso){
        Curso deletarCurso = cursoRepository.findCursoByIdCurso(idCurso)
                .orElseThrow(() -> new CursoNaoEncontradoException("O curso requerido não existe."));

        if(!deletarCurso.getAlunos().isEmpty() || !deletarCurso.getProfessores().isEmpty()
            || !deletarCurso.getGrupos().isEmpty()){
            throw new RecursoNaoPermitidoException("Há dados dentro deste curso!");
        }

        cursoRepository.delete(deletarCurso);
    }

    private void validarCurso(CursoRequestDTO dto) {
        if (cursoRepository.existsByNomeAndEtec_CodEtecAndPeriodo(dto.nome(), dto.codEtec(), dto.periodo())) {
            throw new RecursoJaEncontradoException("Esse curso já existe nesta Etec");
        }
    }

    private void validarCodEtec(String codEtec){
        boolean existsCodEtec = etecRepository.existsByCodEtec(codEtec.trim());

        if(!existsCodEtec){
            throw new EtecNaoEncontradaException("A etec requerida não existe!");
        }
    }
}

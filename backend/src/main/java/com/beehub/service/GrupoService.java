package com.beehub.service;

import com.beehub.dto.comum.*;
import com.beehub.dto.request.GrupoRequestDTO;
import com.beehub.dto.response.GrupoResponseDTO;
import com.beehub.dto.update.GrupoRequestAtualizarDTO;
import com.beehub.entity.Aluno;
import com.beehub.entity.Grupo;
import com.beehub.entity.Orientacao;
import com.beehub.exceptions.*;
import com.beehub.repository.AlunoRepository;
import com.beehub.repository.GrupoRepository;
import com.beehub.repository.OrientacaoRepository;
import com.beehub.repository.ProfessorRepository;
import com.beehub.security.SessaoValidator;
import com.beehub.security.UsuarioValidator;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
public class GrupoService {
    private final AlunoRepository alunoRepository;
    private final GrupoRepository grupoRepository;
    private final OrientacaoRepository orientacaoRepository;
    private final ProfessorRepository professorRepository;
    private final UsuarioValidator usuarioValidator;
    private static final String URL_FOTO_PADRAO = "/imagens/foto-sem-perfil.png";

    public GrupoService(AlunoRepository alunoRepository, GrupoRepository grupoRepository,
                        ProfessorRepository professorRepository, OrientacaoRepository orientacaoRepository,
                        UsuarioValidator usuarioValidator){
        this.alunoRepository = alunoRepository;
        this.grupoRepository = grupoRepository;
        this.orientacaoRepository = orientacaoRepository;
        this.professorRepository = professorRepository;
        this.usuarioValidator = usuarioValidator;
    }

    @Transactional
    public GrupoResumoDTO cadastrarGrupo(GrupoRequestDTO dto, Long rmProfessor){
        String nomeNormalizado = dto.nomeGrupo().trim();

        Orientacao buscarOrientacao = orientacaoRepository.findOrientacaoByIdOrientacao(dto.idOrientacao())
                .orElseThrow(() -> new OrientacaoNaoEncontradaException("Não existe uma orientação com esse ID."));

        validarProfessorOrientacao(buscarOrientacao, rmProfessor);

        if(grupoRepository.existsByNomeGrupoIgnoreCase(nomeNormalizado)){
            throw new GrupoNomeJaUtilizadoException();
        }

        if(dto.ano() < LocalDate.now().getYear()){
            throw new AnoInvalidoException();
        }

        Grupo novoGrupo = new Grupo();

        novoGrupo.setOrientacao(buscarOrientacao);
        novoGrupo.setNomeGrupo(nomeNormalizado);
        novoGrupo.setCapacidadeMaxima(dto.capacidadeMaxima());
        novoGrupo.setAno(dto.ano());
        novoGrupo.setLinkFoto(URL_FOTO_PADRAO);

        Grupo salvarGrupo = grupoRepository.save(novoGrupo);

        return new GrupoResumoDTO(
          salvarGrupo.getIdGrupo(),
          salvarGrupo.getLinkFoto(),
          salvarGrupo.getNomeGrupo(),
          salvarGrupo.getOrientacao().getProfessor().getNome(),
          salvarGrupo.getAno()
        );
    }

    @Transactional
    public GrupoResponseDTO atualizarGrupo(GrupoRequestAtualizarDTO dto, Long idGrupo,
                                           Long rmAluno){
        Grupo atualizarGrupo = grupoRepository.findByIdGrupo(idGrupo)
                .orElseThrow(() -> new GrupoNaoEncontradoException("Grupo não encontrado!"));

        usuarioValidator.validarAlunoGrupo(atualizarGrupo, rmAluno);

        String novoNomeGrupo = dto.nomeGrupo();
        String novaFoto = dto.linkFoto();

        if(novoNomeGrupo != null && !novoNomeGrupo.isBlank()){
            if(grupoRepository.existsByNomeGrupoIgnoreCaseAndIdGrupoNot(novoNomeGrupo, idGrupo)){
                throw new GrupoNomeJaUtilizadoException("Outro grupo já utiliza este nome!");
            }

            atualizarGrupo.setNomeGrupo(novoNomeGrupo.trim());
        }

        if(novaFoto != null && !novaFoto.isBlank()){
            atualizarGrupo.setLinkFoto(novaFoto);
        }

        Grupo grupoAtualizado = grupoRepository.save(atualizarGrupo);

        List<UsuarioResumoDTO> alunosDTO = grupoAtualizado.getAlunos().stream()
                .map(a -> new UsuarioResumoDTO(
                        a.getRmAluno(),
                        a.getNome(),
                        a.getLinkFoto()
                ))
                .toList();

        return new GrupoResponseDTO(
                grupoAtualizado.getIdGrupo(),
                grupoAtualizado.getNomeGrupo(),
                grupoAtualizado.getLinkFoto(),
                grupoAtualizado.getOrientacao().getProfessor().getNome(),
                grupoAtualizado.getOrientacao().getCurso().getEtec().getNome(),
                grupoAtualizado.getOrientacao().getCurso().getNome(),
                grupoAtualizado.getAno(),
                alunosDTO
        );
    }

    @Transactional
    public void adicionarAluno(Long rmAluno, Long idGrupo, Long rmProfessor){
        Grupo grupo = grupoRepository.findByIdGrupo(idGrupo)
                .orElseThrow(() -> new GrupoNaoEncontradoException("Grupo não encontrado!"));

        validarProfessorGrupo(grupo, rmProfessor);

        Aluno aluno = alunoRepository.findByRmAluno(rmAluno)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Aluno não encontrado!"));

        if(aluno.getGrupo().equals(grupo)){
            throw new AlunoJaEstaNoGrupoException("Aluno já está no grupo!");
        }

        Integer quant = grupo.getCapacidadeMaxima();

        if(grupo.getAlunos().size() >= quant){
            throw new QuantidadeAlunosMaximaException("O grupo atual excede o máximo de alunos!");
        }

        if(!Objects.equals(aluno.getCurso().getIdCurso(),
                grupo.getOrientacao().getCurso().getIdCurso())){
            throw new CursoInvalidoException("O aluno não pertence a este curso!");
        }

        aluno.setGrupo(grupo);

        alunoRepository.save(aluno);
    }

    @Transactional
    public void removerAluno(Long rmAluno, Long idGrupo, Long rmProfessor){
        Grupo grupo = grupoRepository.findByIdGrupo(idGrupo)
                        .orElseThrow(() -> new GrupoNaoEncontradoException("Grupo não encontrado"));

        validarProfessorGrupo(grupo, rmProfessor);

        Aluno aluno = alunoRepository.findByRmAluno(rmAluno)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Aluno não encontrado!"));

        if(!aluno.getGrupo().getIdGrupo().equals(grupo.getIdGrupo())){
            throw new GrupoInvalidoException("O aluno não está nesse grupo!");
        }

        aluno.setGrupo(null);

        alunoRepository.save(aluno);
    }

    @Transactional(readOnly = true)
    public GrupoResponseDTO listarGrupo(Long idGrupo){
        Grupo listarGrupo = grupoRepository.findByIdGrupo(idGrupo)
                .orElseThrow(() -> new GrupoNaoEncontradoException("Grupo não encontrado!"));

        List<UsuarioResumoDTO> alunosDTO = listarGrupo.getAlunos().stream()
                .map(a -> new UsuarioResumoDTO(
                        a.getRmAluno(),
                        a.getNome(),
                        a.getLinkFoto()
                ))
                .toList();

        return new GrupoResponseDTO(
                listarGrupo.getIdGrupo(),
                listarGrupo.getNomeGrupo(),
                listarGrupo.getLinkFoto(),
                listarGrupo.getOrientacao().getProfessor().getNome(),
                listarGrupo.getOrientacao().getCurso().getEtec().getNome(),
                listarGrupo.getOrientacao().getCurso().getNome(),
                listarGrupo.getAno(),
                alunosDTO
        );
    }

    @Transactional(readOnly = true)
    public List<GrupoResumoDTO> listarGruposDoProfessor(Long rmProfessor){

        if(!professorRepository.existsByRmProfessor(rmProfessor)){
            throw new UsuarioNaoEncontradoException("Professor não encontrado!");
        }

        //buscar orientações do professor
        List<Orientacao> orientacoes = orientacaoRepository.findAllByProfessor_RmProfessor(rmProfessor);

        //flatMap = juntar o grupo de todas as orientações
        List<Grupo> grupos = orientacoes.stream()
                .flatMap(o -> o.getGrupos().stream())
                .toList();

        return grupos.stream()
                .map(g -> new GrupoResumoDTO(
                        g.getIdGrupo(),
                        g.getLinkFoto(),
                        g.getNomeGrupo(),
                        g.getOrientacao().getProfessor().getNome(),
                        g.getAno()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<GrupoResumoDTO> listarTodosGrupos(Integer ano, Long idCurso){
        List<Grupo> grupos = grupoRepository.findByFiltros(ano, idCurso);

        return grupos.stream()
                .map(g -> new GrupoResumoDTO(
                        g.getIdGrupo(),
                        g.getLinkFoto(),
                        g.getNomeGrupo(),
                        g.getOrientacao().getProfessor().getNome(),
                        g.getAno()
                ))
                .toList();
    }

    @Transactional
    public void excluirGrupo(Long idGrupo, Long rmProfessor){
        Grupo deletarGrupo = grupoRepository.findByIdGrupo(idGrupo)
                .orElseThrow(() -> new GrupoNaoEncontradoException("Grupo não encontrado!"));

        validarProfessorGrupo(deletarGrupo, rmProfessor);

        if(!deletarGrupo.getAlunos().isEmpty()){
            throw new GrupoContemAlunosException("Este grupo contém alunos!");
        }

        if(deletarGrupo.getTcc() != null){
            throw new GrupoContemTccException("Este grupo está desenvolvendo o TCC!");
        }

        grupoRepository.delete(deletarGrupo);
    }

    private void validarProfessorGrupo(Grupo grupo, Long rmProfessor){
        validarProfessorOrientacao(grupo.getOrientacao(), rmProfessor);
    }

    private void validarProfessorOrientacao(Orientacao orientacao, Long rmProfesor){
        if(!rmProfesor.equals(orientacao.getProfessor().getRmProfessor())){
            throw new OrientadorInvalidoException("Você não orienta esse curso!");
        }
    }
}

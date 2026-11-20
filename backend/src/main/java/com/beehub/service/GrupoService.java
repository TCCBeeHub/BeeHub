package com.beehub.service;

import com.beehub.dto.comum.*;
import com.beehub.dto.request.GrupoRequestDTO;
import com.beehub.dto.response.GrupoResponseDTO;
import com.beehub.dto.update.GrupoRequestAtualizarDTO;
import com.beehub.dto.update.GrupoProfessorAtualizarDTO;
import com.beehub.entity.Aluno;
import com.beehub.entity.Grupo;
import com.beehub.entity.Orientacao;
import com.beehub.enums.StatusTcc;
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
import java.util.HashSet;
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

        Orientacao buscarOrientacao = orientacaoRepository.findByIdOrientacao(dto.idOrientacao())
                .orElseThrow(() -> new OrientacaoNaoEncontradaException("Não existe uma orientação com esse ID."));

        validarProfessorOrientacao(buscarOrientacao, rmProfessor);

        if(grupoRepository.existsByNomeGrupoIgnoreCase(nomeNormalizado)){
            throw new GrupoNomeJaUtilizadoException();
        }

        if(dto.ano() < LocalDate.now().getYear()){
            throw new AnoInvalidoException();
        }

        List<Long> rmsAlunos = dto.rmsAlunos() == null ? List.of() : dto.rmsAlunos();
        if (new HashSet<>(rmsAlunos).size() != rmsAlunos.size()) {
            throw new GrupoInvalidoException("Um aluno não pode ser selecionado mais de uma vez.");
        }
        if (rmsAlunos.size() > dto.capacidadeMaxima()) {
            throw new QuantidadeAlunosMaximaException("A quantidade de alunos excede a capacidade do grupo.");
        }

        List<Aluno> alunosSelecionados = rmsAlunos.stream()
                .map(rmAluno -> alunoRepository.findByRmAluno(rmAluno)
                        .orElseThrow(() -> new UsuarioNaoEncontradoException("Aluno não encontrado!")))
                .toList();

        Grupo novoGrupo = new Grupo();

        novoGrupo.setOrientacao(buscarOrientacao);
        novoGrupo.setNomeGrupo(nomeNormalizado);
        novoGrupo.setCapacidadeMaxima(dto.capacidadeMaxima());
        novoGrupo.setAno(dto.ano());
        novoGrupo.setLinkFoto(URL_FOTO_PADRAO);

        alunosSelecionados.forEach(aluno -> validarAlunoElegivel(aluno, novoGrupo));

        Grupo salvarGrupo = grupoRepository.save(novoGrupo);

        alunosSelecionados.forEach(aluno -> {
            aluno.setGrupo(salvarGrupo);
        });
        if (!alunosSelecionados.isEmpty()) {
            alunoRepository.saveAll(alunosSelecionados);
        }

        return new GrupoResumoDTO(
          salvarGrupo.getIdGrupo(),
          salvarGrupo.getOrientacao().getIdOrientacao(),
          salvarGrupo.getLinkFoto(),
          salvarGrupo.getNomeGrupo(),
          salvarGrupo.getOrientacao().getProfessor().getNome(),
          salvarGrupo.getAno(),
          salvarGrupo.getCapacidadeMaxima()
        );
    }

    @Transactional
    public GrupoResponseDTO atualizarGrupo(GrupoRequestAtualizarDTO dto, Long idGrupo,
                                           Long rmAluno){
        Grupo atualizarGrupo = grupoRepository.findByIdGrupo(idGrupo)
                .orElseThrow(() -> new GrupoNaoEncontradoException("Grupo não encontrado!"));

        if(atualizarGrupo.getTcc() != null && atualizarGrupo.getTcc().getStatus() == StatusTcc.PUBLICADO){
            throw new TccJaFoiPublicadoException("Este TCC já foi publicado!");
        }

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
                        a.getLinkFoto(),
                        a.getTurma(),
                        a.getGrupo() != null ? a.getGrupo().getIdGrupo() : null
                ))
                .toList();

        return new GrupoResponseDTO(
                grupoAtualizado.getIdGrupo(),
                grupoAtualizado.getOrientacao().getIdOrientacao(),
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

        validarAlunoElegivel(aluno, grupo);

        Integer quant = grupo.getCapacidadeMaxima();
        int alunosNoGrupo = grupo.getAlunos() == null ? 0 : grupo.getAlunos().size();
        if(alunosNoGrupo >= quant){
            throw new QuantidadeAlunosMaximaException("O grupo atual excede o máximo de alunos!");
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
                        a.getLinkFoto(),
                        a.getTurma(),
                        a.getGrupo() != null ? a.getGrupo().getIdGrupo() : null
                ))
                .toList();

        return new GrupoResponseDTO(
                listarGrupo.getIdGrupo(),
                listarGrupo.getOrientacao().getIdOrientacao(),
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
                        g.getOrientacao().getIdOrientacao(),
                        g.getLinkFoto(),
                        g.getNomeGrupo(),
                        g.getOrientacao().getProfessor().getNome(),
                        g.getAno(),
                        g.getCapacidadeMaxima()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<GrupoResumoDTO> listarTodosGrupos(Integer ano, Long idCurso){
        List<Grupo> grupos = grupoRepository.findByFiltros(ano, idCurso);

        return grupos.stream()
                .map(g -> new GrupoResumoDTO(
                        g.getIdGrupo(),
                        g.getOrientacao().getIdOrientacao(),
                        g.getLinkFoto(),
                        g.getNomeGrupo(),
                        g.getOrientacao().getProfessor().getNome(),
                        g.getAno(),
                        g.getCapacidadeMaxima()
                ))
                .toList();
    }

    @Transactional
    public void atualizarGrupoProfessor(GrupoProfessorAtualizarDTO dto, Long idGrupo,
                                        Long rmProfessor) {
        Grupo grupo = grupoRepository.findByIdGrupo(idGrupo)
                .orElseThrow(() -> new GrupoNaoEncontradoException("Grupo não encontrado!"));

        validarProfessorGrupo(grupo, rmProfessor);

        if (dto.nomeGrupo() != null && !dto.nomeGrupo().isBlank()) {
            String nomeNormalizado = dto.nomeGrupo().trim();
            if (grupoRepository.existsByNomeGrupoIgnoreCaseAndIdGrupoNot(
                    nomeNormalizado, idGrupo)) {
                throw new GrupoNomeJaUtilizadoException("Outro grupo já utiliza este nome!");
            }
            grupo.setNomeGrupo(nomeNormalizado);
        }

        if (dto.linkFoto() != null) {
            grupo.setLinkFoto(
                    dto.linkFoto().isBlank() ? URL_FOTO_PADRAO : dto.linkFoto().trim()
            );
        }

        if (dto.capacidadeMaxima() != null) {
            if (dto.capacidadeMaxima() < grupo.getAlunos().size()) {
                throw new QuantidadeAlunosMaximaException(
                        "A capacidade não pode ser inferior aos alunos vinculados."
                );
            }
            grupo.setCapacidadeMaxima(dto.capacidadeMaxima());
        }

        if (dto.ano() != null) {
            if (dto.ano() < LocalDate.now().getYear()
                    && !Objects.equals(dto.ano(), grupo.getAno())) {
                throw new AnoInvalidoException();
            }
            grupo.setAno(dto.ano());
        }

        grupoRepository.save(grupo);
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

    private void validarAlunoElegivel(Aluno aluno, Grupo grupo) {
        if (aluno.getGrupo() != null) {
            throw new AlunoJaEstaNoGrupoException("O aluno já está vinculado a um grupo!");
        }

        Long idCursoAluno = aluno.getCurso() == null ? null : aluno.getCurso().getIdCurso();
        Long idCursoOrientacao = grupo.getOrientacao().getCurso() == null
                ? null
                : grupo.getOrientacao().getCurso().getIdCurso();
        if (!Objects.equals(idCursoAluno, idCursoOrientacao)) {
            throw new CursoInvalidoException("O aluno não pertence ao curso desta orientação!");
        }

        if (!Objects.equals(aluno.getTurma(), grupo.getOrientacao().getTurma())) {
            throw new GrupoInvalidoException("A turma do aluno não corresponde à turma desta orientação!");
        }
    }

    private void validarProfessorOrientacao(Orientacao orientacao, Long rmProfesor){
        if(!rmProfesor.equals(orientacao.getProfessor().getRmProfessor())){
            throw new OrientadorInvalidoException("Você não orienta esse curso!");
        }
    }
}

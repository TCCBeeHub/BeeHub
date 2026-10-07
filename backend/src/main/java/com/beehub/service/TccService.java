package com.beehub.service;

import com.beehub.dto.comum.TccResumoDTO;
import com.beehub.dto.request.TccRequestDTO;
import com.beehub.dto.response.TccResponseDTO;
import com.beehub.dto.update.TccRequestAtualizarDTO;
import com.beehub.entity.Grupo;
import com.beehub.entity.Tcc;
import com.beehub.enums.StatusTcc;
import com.beehub.exceptions.*;
import com.beehub.repository.AlunoRepository;
import com.beehub.repository.GrupoRepository;
import com.beehub.repository.TccRepository;
import com.beehub.security.UsuarioValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import com.beehub.security.SessaoValidator;

import java.time.LocalDate;

@Service
public class TccService {
    private final AlunoRepository alunoRepository;
    private final GrupoRepository grupoRepository;
    private final TccRepository tccRepository;
    private final UsuarioValidator usuarioValidator;
    private final SessaoValidator sessaoValidator;

    public TccService(AlunoRepository alunoRepository, GrupoRepository grupoRepository,
                      TccRepository tccRepository, UsuarioValidator usuarioValidator){
        this.alunoRepository = alunoRepository;
        this.grupoRepository = grupoRepository;
        this.tccRepository = tccRepository;
        this.usuarioValidator = usuarioValidator;
    }

    @Transactional
    public TccResumoDTO criarTcc(TccRequestDTO dto, Long idGrupo, Long rmAluno){
        String temaNormalizado = dto.tema().trim();
        String descricao = dto.descricao();

        Grupo grupo = grupoRepository.findByIdGrupo(idGrupo)
                .orElseThrow(() -> new GrupoNaoEncontradoException("Grupo não encontrado!"));

        usuarioValidator.validarAlunoGrupo(grupo, rmAluno);

        if(grupo.getTcc() != null){
            throw new GrupoContemTccException("Este grupo já possui um TCC!");
        }

        if(tccRepository.existsByTemaIgnoreCase(temaNormalizado)){
            throw new TemaJaUtilizadoException("Outro TCC já adotou este tema!");
        }

        Tcc novoTcc = new Tcc();

        novoTcc.setTema(temaNormalizado);
        novoTcc.setDescricao(descricao);
        novoTcc.setDataCriacao(LocalDate.now());
        novoTcc.setStatus(StatusTcc.EM_ANDAMENTO);
        novoTcc.setGrupo(grupo);

        Tcc salvarTcc = tccRepository.save(novoTcc);

        return new TccResumoDTO(
            salvarTcc.getCodTcc(),
            salvarTcc.getGrupo().getNomeGrupo(),
            salvarTcc.getTema(),
            salvarTcc.getDescricao(),
            salvarTcc.getStatus()
        );
    }

    @Transactional
    public void atualizarTcc(TccRequestAtualizarDTO dto, Long idGrupo, Long rmAluno){
        String novaDescricao = dto.descricao();
        String novoLinkArtigoNormalizado = dto.linkArtigo();
        String novoLinkSiteNormalizado = dto.linkSite();
        String novoLinkSlideNormalizado = dto.linkSlide();

        Grupo grupo = grupoRepository.findByIdGrupo(idGrupo)
                .orElseThrow(() -> new GrupoNaoEncontradoException("Grupo não encontrado!"));

        usuarioValidator.validarAlunoGrupo(grupo, rmAluno);

        Tcc atualizarTcc = tccRepository.findByGrupo_IdGrupo(idGrupo)
                .orElseThrow(() -> new GrupoNaoEncontradoException("Grupo não encontrado!"));

        if(novaDescricao != null && !novaDescricao.isBlank()){
            atualizarTcc.setDescricao(novaDescricao);
        }

        if(novoLinkArtigoNormalizado != null && !novoLinkArtigoNormalizado.isBlank()){
            atualizarTcc.setLinkArtigo(novoLinkArtigoNormalizado.trim());
        }

        if(novoLinkSiteNormalizado != null && !novoLinkSiteNormalizado.isBlank()){
            atualizarTcc.setLinkSite(novoLinkSiteNormalizado.trim());
        }

        if(novoLinkSlideNormalizado != null && !novoLinkSlideNormalizado.isBlank()){
            atualizarTcc.setLinkSlide(novoLinkSlideNormalizado.trim());
        }

        Tcc salvarTcc = tccRepository.save(atualizarTcc);

    }

    @Transactional(readOnly = true)
    public TccResponseDTO listarTcc(long codTcc){
        Tcc tcc = TccRepository.findById(codTcc)
                .orElseThrow(()-> new TccNaoEncontradoException("TCC não encontrado!"));
        return  new TccResponseDTO(tcc);
    }

    @Transactional(readOnly = true)
    public TccResponseDTO listarTccDoGrupo(long idGrupo){
        Tcc tcc = TccRepository.findById_IdGrupo(idGrupo)
                .orElseThrow(() -> new TccNaoEncontradoException("O TCC do grupo não foi encontrado!"));
        return  new TccResponseDTO(tcc);
    }

    public List<TccResumoDTO> listarTccsPublicos() {
        return tccRepository.findAllByStatus(StatusTcc.PUBLICADO)
                .stream()
                .map(TccResumoDTO::new)
                .toList();
    }

    @Transactional
    public void aprovarTcc(Long codTcc, Long rmProfessor){
        usuarioValidator.valiadarPro

        Tcc tcc = TccRepository.findById(codTcc)
                .orElseThrow(() -> new TccNaoEncontradoException("TCC não encontrado!"));

        tcc.setStatus(StatusTcc.APROVADO);
        TccRepository.save(tcc);
    }

    @Transactional
    public void reaprovarTcc(Long codTcc, Long rmProfessor){


        Tcc tcc = TccRepository.findById(codTcc)
                .orElseThrow(() -> TccNaoEncontradoException("Tcc não encontrado!"));

        tcc.setStatus(StatusTcc.REPROVADO);
        TccRepository.save(tcc);
    }

    @Transactional
    public void publicarTcc(Long codTcc, Long rmAluno){
        usuarioValidator.validarRm(rmAluno);

        Tcc tcc = TccRepository.findById(codTcc)
                .orElseThrow(() -> new TccNaoEncontradoException("TCC não encontrado!"));

        if (tcc.getStatus() != StatusTcc.APROVADO) {
            throw new TccNaoAprovadoException("Somente TCCs aprovados podem ser publicados!");
        }

        tcc.setStatus(StatusTcc.PUBLICADO);
        TccRepository.save(tcc);
    }

    @Transactional
    public void excluirTcc(Long codTcc, Long rmProfessor, boolean isProfessor, Long rmAluno) {
        Tcc tcc = TccRepository.findById(codTcc)
                .orElseThrow(() -> new TccNaoEncontradoException("TCC não encontrado!"));

        if (isProfessor) {
            usuarioValidator.validarRm(rmProfessor);
        } else {
            // Se for aluno, valida se faz parte do grupo e se o TCC ainda não foi finalizado
            usuarioValidator.validarAlunoGrupo(tcc.getGrupo(), rmAluno);

            if (tcc.getStatus() == StatusTcc.PUBLICADO || tcc.getStatus() == StatusTcc.APROVADO) {
                throw new RegraNegocioException("Não é possível excluir um TCC que já foi aprovado ou publicado!");
            }
        }

        TccRepository.delete(tcc);
    }
}

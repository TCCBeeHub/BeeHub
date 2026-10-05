package com.beehub.service;

import com.beehub.dto.comum.TccResumoDTO;
import com.beehub.dto.request.TccRequestDTO;
import com.beehub.dto.update.TccRequestAtualizarDTO;
import com.beehub.entity.Grupo;
import com.beehub.entity.Tcc;
import com.beehub.exceptions.*;
import com.beehub.repository.AlunoRepository;
import com.beehub.repository.GrupoRepository;
import com.beehub.repository.TccRepository;
import com.beehub.security.UsuarioValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class TccService {
    private final AlunoRepository alunoRepository;
    private final GrupoRepository grupoRepository;
    private final TccRepository tccRepository;
    private final UsuarioValidator usuarioValidator;

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
}

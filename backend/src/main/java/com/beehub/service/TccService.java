package com.beehub.service;

import com.beehub.dto.comum.TccResumoDTO;
import com.beehub.dto.comum.TccUsuarioResumoDTO;
import com.beehub.dto.comum.UsuarioResumoDTO;
import com.beehub.dto.request.TccRequestDTO;
import com.beehub.dto.response.TccPublicadoResponseDTO;
import com.beehub.dto.response.TccResponseDTO;
import com.beehub.dto.response.TccStatusResponseDTO;
import com.beehub.dto.update.TccRequestAtualizarDTO;
import com.beehub.entity.Grupo;
import com.beehub.entity.Tcc;
import com.beehub.enums.StatusTcc;
import com.beehub.exceptions.*;
import com.beehub.repository.AlunoRepository;
import com.beehub.repository.GrupoRepository;
import com.beehub.repository.ProfessorRepository;
import com.beehub.repository.TccRepository;
import com.beehub.security.UsuarioValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Month;
import java.util.List;

import java.time.LocalDate;

@Service
public class TccService {
    private final GrupoRepository grupoRepository;
    private final TccRepository tccRepository;
    private final UsuarioValidator usuarioValidator;

    public TccService(GrupoRepository grupoRepository,
                      TccRepository tccRepository, UsuarioValidator usuarioValidator){
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
    public TccResponseDTO atualizarTcc(TccRequestAtualizarDTO dto, Long idGrupo, Long rmAluno){
        String novaDescricao = dto.descricao();
        String novoLinkArtigoNormalizado = dto.linkArtigo();
        String novoLinkSiteNormalizado = dto.linkSite();
        String novoLinkSlideNormalizado = dto.linkSlide();

        Grupo grupo = grupoRepository.findByIdGrupo(idGrupo)
                .orElseThrow(() -> new GrupoNaoEncontradoException("Grupo não encontrado!"));

        usuarioValidator.validarAlunoGrupo(grupo, rmAluno);

        Tcc atualizarTcc = tccRepository.findByGrupo_IdGrupo(idGrupo)
                .orElseThrow(() -> new TccNaoEncontradoException("Tcc não encontrado!"));

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

        return new TccResponseDTO(
                salvarTcc.getCodTcc(),
                salvarTcc.getGrupo().getNomeGrupo(),
                salvarTcc.getTema(),
                salvarTcc.getDescricao(),
                salvarTcc.getGrupo().getLinkFoto(),
                salvarTcc.getLinkArtigo(),
                salvarTcc.getLinkSite(),
                salvarTcc.getLinkSlide()
        );
    }

    @Transactional(readOnly = true)
    public TccUsuarioResumoDTO listarTcc(Long idGrupo){
        Grupo grupo = grupoRepository.findByIdGrupo(idGrupo)
                .orElseThrow(() -> new GrupoNaoEncontradoException("Grupo não encontrado!"));

        Tcc buscarTcc = tccRepository.findByGrupo_IdGrupo(grupo.getIdGrupo())
                .orElseThrow(() -> new TccNaoEncontradoException("Este grupo não possui TCC!"));


        List<UsuarioResumoDTO> alunosDTO = grupo.getAlunos().stream()
                .map(a -> new UsuarioResumoDTO(
                        a.getRmAluno(),
                        a.getNome(),
                        a.getLinkFoto()
                ))
                .toList();

        return new TccUsuarioResumoDTO(
                buscarTcc.getCodTcc(),
                grupo.getNomeGrupo(),
                buscarTcc.getTema(),
                buscarTcc.getDescricao(),
                buscarTcc.getStatus(),
                alunosDTO,
                grupo.getOrientacao().getProfessor().getNome()
        );
    }

    @Transactional(readOnly = true)
    public TccResumoDTO listarTccDoGrupo(Long idGrupo, Long rmUsuario){
        Grupo grupo = grupoRepository.findByIdGrupo(idGrupo)
                .orElseThrow(() -> new GrupoNaoEncontradoException("Grupo não encontrado!"));

        Tcc tcc = tccRepository.findByGrupo_IdGrupo(idGrupo)
                .orElseThrow(() -> new TccNaoEncontradoException("Seu grupo não possui TCC!"));

        usuarioValidator.validarAcessoAoTcc(grupo, rmUsuario);

        return new TccResumoDTO(
                tcc.getCodTcc(),
                tcc.getGrupo().getNomeGrupo(),
                tcc.getTema(),
                tcc.getDescricao(),
                tcc.getStatus()
        );
    }

    @Transactional(readOnly = true)
    public List<TccPublicadoResponseDTO> listarTccsPublicos() {

        return tccRepository.findAllByStatus(StatusTcc.PUBLICADO)
                .stream()
                .map(TccPublicadoResponseDTO::new)
                .toList();
    }

    @Transactional
    public TccStatusResponseDTO entregarTcc(Long codTcc, Long rmAluno){
        Tcc tcc = tccRepository.findByCodTcc(codTcc)
                .orElseThrow(() -> new TccNaoEncontradoException("TCC não encontrado"));

        usuarioValidator.validarAlunoGrupo(tcc.getGrupo(), rmAluno);

        if(tcc.getStatus() != StatusTcc.EM_ANDAMENTO){
            throw new TccJaEntregueException("Este tcc já foi entregue ou avaliado!");
        }

        LocalDate validarEntrega = LocalDate.of(LocalDate.now().getYear(), Month.OCTOBER, 30);

        if(LocalDate.now().isBefore(validarEntrega)){
            throw new RecursoNaoPermitidoException("A entrega dos trabalhos será liberada após 30/10!");
        }

        tcc.setStatus(StatusTcc.ENTREGUE);

        Tcc entregarTcc = tccRepository.save(tcc);

        return new TccStatusResponseDTO(
                entregarTcc.getGrupo().getNomeGrupo(),
                entregarTcc.getTema(),
                entregarTcc.getStatus()
        );
    }

    @Transactional
    public TccStatusResponseDTO aprovarTcc(Long codTcc, Long rmProfessor){
        Tcc tcc = tccRepository.findByCodTcc(codTcc)
                .orElseThrow(() -> new TccNaoEncontradoException("TCC não encontrado!"));

        validarProfessorGrupo(tcc.getGrupo(), rmProfessor);

        if(tcc.getStatus() != StatusTcc.ENTREGUE){
            throw new TccNaoFoiEntregueException("TCC não foi entregue!");
        }

        tcc.setStatus(StatusTcc.APROVADO);
        tccRepository.save(tcc);

        return new TccStatusResponseDTO(
                tcc.getGrupo().getNomeGrupo(),
                tcc.getTema(),
                tcc.getStatus()
        );
    }

    @Transactional
    public TccStatusResponseDTO reprovarTcc(Long codTcc, Long rmProfessor){
        Tcc tcc = tccRepository.findByCodTcc(codTcc)
                .orElseThrow(() -> new TccNaoEncontradoException("TCC não encontrado!"));

        validarProfessorGrupo(tcc.getGrupo(), rmProfessor);

        if(tcc.getStatus() != StatusTcc.ENTREGUE){
            throw new TccNaoFoiEntregueException("TCC não foi entregue!");
        }

        tcc.setStatus(StatusTcc.REPROVADO);
        tccRepository.save(tcc);

        return new TccStatusResponseDTO(
                tcc.getGrupo().getNomeGrupo(),
                tcc.getTema(),
                tcc.getStatus()
        );
    }

    @Transactional
    public TccStatusResponseDTO publicarTcc(Long codTcc, Long rmProfessor){
        Tcc tcc = tccRepository.findByCodTcc(codTcc)
                .orElseThrow(() -> new TccNaoEncontradoException("TCC não encontrado!"));

        validarProfessorGrupo(tcc.getGrupo(), rmProfessor);

        if(tcc.getStatus() != StatusTcc.APROVADO){
            throw new TccNaoAprovadoException("TCC não passou pela seção de aprovação!");
        }

        tcc.setStatus(StatusTcc.PUBLICADO);
        tccRepository.save(tcc);

        return new TccStatusResponseDTO(
                tcc.getGrupo().getNomeGrupo(),
                tcc.getTema(),
                tcc.getStatus()
        );
    }

    @Transactional
    public void excluirTcc(Long idGrupo, Long rmProfessor) {

        Tcc tcc = tccRepository.findByGrupo_IdGrupo(idGrupo)
                .orElseThrow(() -> new TccNaoEncontradoException("TCC não encontrado!"));

        validarProfessorGrupo(tcc.getGrupo(), rmProfessor);

        tccRepository.delete(tcc);
    }

    private void validarProfessorGrupo(Grupo grupo, Long rmProfessor){
        if(!grupo.getOrientacao().getProfessor().getRmProfessor().equals(rmProfessor)){
            throw new OrientadorInvalidoException("Você não orienta este grupo!");
        }
    }
}

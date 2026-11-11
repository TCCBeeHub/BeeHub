package com.beehub.service;

import com.beehub.entity.Grupo;
import com.beehub.entity.MensagemGrupo;
import com.beehub.exceptions.AcessoNaoPermitidoException;
import com.beehub.enums.TipoRemetenteMensagem;
import com.beehub.repository.AlunoRepository;
import com.beehub.repository.GrupoRepository;
import com.beehub.repository.MensagemGrupoRepository;
import com.beehub.repository.ProfessorRepository;
import com.beehub.security.UsuarioValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class MensagemGrupoServiceTest {
    private MensagemGrupoRepository mensagemRepository;
    private GrupoRepository grupoRepository;
    private AlunoRepository alunoRepository;
    private ProfessorRepository professorRepository;
    private UsuarioValidator usuarioValidator;
    private MensagemGrupoService service;

    @BeforeEach
    void setUp() {
        mensagemRepository = mock(MensagemGrupoRepository.class);
        grupoRepository = mock(GrupoRepository.class);
        alunoRepository = mock(AlunoRepository.class);
        professorRepository = mock(ProfessorRepository.class);
        usuarioValidator = mock(UsuarioValidator.class);
        service = new MensagemGrupoService(
                mensagemRepository,
                grupoRepository,
                alunoRepository,
                professorRepository,
                usuarioValidator
        );
    }

    @Test
    void refusesToReadMessagesWhenStudentDoesNotBelongToGroup() {
        Grupo grupo = new Grupo();
        when(grupoRepository.findByIdGrupo(12L)).thenReturn(Optional.of(grupo));
        doThrow(new AcessoNaoPermitidoException("Acesso negado"))
                .when(usuarioValidator).validarAlunoGrupo(grupo, 54321L);

        assertThrows(
                AcessoNaoPermitidoException.class,
                () -> service.listar(12L, 54321L, TipoRemetenteMensagem.ALUNO)
        );
        verifyNoInteractions(mensagemRepository);
    }

    @Test
    void listsMessagesOnlyAfterCheckingTheProfessorGroupRelationship() {
        Grupo grupo = new Grupo();
        when(grupoRepository.findByIdGrupo(12L)).thenReturn(Optional.of(grupo));
        when(mensagemRepository.findTop100ByGrupo_IdGrupoOrderByEnviadaEmDesc(12L))
                .thenReturn(List.of());

        service.listar(12L, 12345L, TipoRemetenteMensagem.PROFESSOR);

        verify(usuarioValidator).validarProfessorGrupo(grupo, 12345L);
        verify(mensagemRepository).findTop100ByGrupo_IdGrupoOrderByEnviadaEmDesc(12L);
    }
}

package com.beehub.service;

import com.beehub.dto.comum.GrupoResumoDTO;
import com.beehub.dto.request.GrupoRequestDTO;
import com.beehub.entity.Aluno;
import com.beehub.entity.Curso;
import com.beehub.entity.Grupo;
import com.beehub.entity.Orientacao;
import com.beehub.entity.Professor;
import com.beehub.enums.GrupoOrientacao;
import com.beehub.exceptions.AlunoJaEstaNoGrupoException;
import com.beehub.exceptions.CursoInvalidoException;
import com.beehub.exceptions.GrupoInvalidoException;
import com.beehub.repository.AlunoRepository;
import com.beehub.repository.GrupoRepository;
import com.beehub.repository.OrientacaoRepository;
import com.beehub.repository.ProfessorRepository;
import com.beehub.security.UsuarioValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Year;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class GrupoServiceTest {
    private AlunoRepository alunoRepository;
    private GrupoRepository grupoRepository;
    private OrientacaoRepository orientacaoRepository;
    private GrupoService service;
    private Orientacao orientacao;

    @BeforeEach
    void setUp() {
        alunoRepository = mock(AlunoRepository.class);
        grupoRepository = mock(GrupoRepository.class);
        orientacaoRepository = mock(OrientacaoRepository.class);
        ProfessorRepository professorRepository = mock(ProfessorRepository.class);
        UsuarioValidator usuarioValidator = mock(UsuarioValidator.class);
        service = new GrupoService(
                alunoRepository,
                grupoRepository,
                professorRepository,
                orientacaoRepository,
                usuarioValidator
        );

        Professor professor = new Professor();
        professor.setRmProfessor(12345L);
        professor.setNome("Professora");

        Curso curso = new Curso();
        curso.setIdCurso(7L);

        orientacao = new Orientacao();
        orientacao.setIdOrientacao(9L);
        orientacao.setProfessor(professor);
        orientacao.setCurso(curso);
        orientacao.setTurma(GrupoOrientacao.A);

        when(orientacaoRepository.findByIdOrientacao(9L)).thenReturn(Optional.of(orientacao));
        when(grupoRepository.existsByNomeGrupoIgnoreCase(any())).thenReturn(false);
        when(grupoRepository.save(any(Grupo.class))).thenAnswer(invocation -> {
            Grupo grupo = invocation.getArgument(0);
            grupo.setIdGrupo(30L);
            return grupo;
        });
    }

    @Test
    void createsGroupAndAssociatesEligibleStudents() {
        Aluno aluno = aluno(100L, 7L, GrupoOrientacao.A);
        when(alunoRepository.findByRmAluno(100L)).thenReturn(Optional.of(aluno));

        GrupoResumoDTO result = service.cadastrarGrupo(
                request(List.of(100L)),
                12345L
        );

        assertEquals(30L, result.idGrupo());
        assertEquals(30L, aluno.getGrupo().getIdGrupo());
        verify(alunoRepository).saveAll(List.of(aluno));
    }

    @Test
    void rejectsStudentsAlreadyAssignedToAnyGroup() {
        Aluno aluno = aluno(100L, 7L, GrupoOrientacao.A);
        aluno.setGrupo(new Grupo());
        when(alunoRepository.findByRmAluno(100L)).thenReturn(Optional.of(aluno));

        assertThrows(
                AlunoJaEstaNoGrupoException.class,
                () -> service.cadastrarGrupo(request(List.of(100L)), 12345L)
        );

        verify(grupoRepository, never()).save(any(Grupo.class));
        verify(alunoRepository, never()).saveAll(any());
    }

    @Test
    void rejectsDuplicateStudentIds() {
        assertThrows(
                GrupoInvalidoException.class,
                () -> service.cadastrarGrupo(request(List.of(100L, 100L)), 12345L)
        );

        verifyNoInteractions(alunoRepository);
        verify(grupoRepository, never()).save(any(Grupo.class));
    }

    @Test
    void rejectsStudentsFromAnotherCourseOrClass() {
        Aluno wrongCourse = aluno(100L, 8L, GrupoOrientacao.A);
        when(alunoRepository.findByRmAluno(100L)).thenReturn(Optional.of(wrongCourse));

        assertThrows(
                CursoInvalidoException.class,
                () -> service.cadastrarGrupo(request(List.of(100L)), 12345L)
        );
        verify(grupoRepository, never()).save(any(Grupo.class));

        Aluno wrongClass = aluno(101L, 7L, GrupoOrientacao.B);
        when(alunoRepository.findByRmAluno(101L)).thenReturn(Optional.of(wrongClass));
        assertThrows(
                GrupoInvalidoException.class,
                () -> service.cadastrarGrupo(request(List.of(101L)), 12345L)
        );
        verify(grupoRepository, never()).save(any(Grupo.class));
    }

    private GrupoRequestDTO request(List<Long> rmsAlunos) {
        return new GrupoRequestDTO(
                "Grupo de teste",
                orientacao.getIdOrientacao(),
                4,
                Year.now().getValue(),
                rmsAlunos
        );
    }

    private Aluno aluno(Long rm, Long idCurso, GrupoOrientacao turma) {
        Curso curso = new Curso();
        curso.setIdCurso(idCurso);

        Aluno aluno = new Aluno();
        aluno.setRmAluno(rm);
        aluno.setCurso(curso);
        aluno.setTurma(turma);
        return aluno;
    }
}

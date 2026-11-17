package com.beehub.service;

import com.beehub.dto.comum.UsuarioResumoDTO;
import com.beehub.entity.Aluno;
import com.beehub.entity.Curso;
import com.beehub.entity.Grupo;
import com.beehub.enums.GrupoOrientacao;
import com.beehub.repository.AlunoRepository;
import com.beehub.repository.CursoRepository;
import com.beehub.security.UsuarioValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;

class AlunoServiceTest {
    private AlunoRepository alunoRepository;
    private CursoRepository cursoRepository;
    private AlunoService service;

    @BeforeEach
    void setUp() {
        alunoRepository = mock(AlunoRepository.class);
        cursoRepository = mock(CursoRepository.class);
        service = new AlunoService(
                alunoRepository,
                mock(PasswordEncoder.class),
                cursoRepository,
                mock(UsuarioValidator.class)
        );
    }

    @Test
    void listsStudentsWithTheirClassAndGroupForProfessorEligibilityFiltering() {
        Curso curso = new Curso();
        curso.setIdCurso(7L);

        Aluno semGrupo = aluno(100L, curso, GrupoOrientacao.A, null);
        Grupo grupo = new Grupo();
        grupo.setIdGrupo(30L);
        Aluno comGrupo = aluno(101L, curso, GrupoOrientacao.B, grupo);

        when(cursoRepository.existsById(7L)).thenReturn(true);
        when(alunoRepository.findAllByCurso_IdCurso(7L)).thenReturn(List.of(semGrupo, comGrupo));

        List<UsuarioResumoDTO> result = service.listarAlunos(7L);

        assertEquals(2, result.size());
        assertEquals(100L, result.get(0).rmUsuario());
        assertEquals(GrupoOrientacao.A, result.get(0).turma());
        assertNull(result.get(0).idGrupo());
        assertEquals(101L, result.get(1).rmUsuario());
        assertEquals(GrupoOrientacao.B, result.get(1).turma());
        assertEquals(30L, result.get(1).idGrupo());
    }

    private Aluno aluno(Long rm, Curso curso, GrupoOrientacao turma, Grupo grupo) {
        Aluno aluno = new Aluno();
        aluno.setRmAluno(rm);
        aluno.setCurso(curso);
        aluno.setTurma(turma);
        aluno.setGrupo(grupo);
        return aluno;
    }
}

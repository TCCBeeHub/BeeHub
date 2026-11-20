package com.beehub.controller;

import com.beehub.dto.comum.UsuarioResumoDTO;
import com.beehub.dto.request.AdministradorRequestDTO;
import com.beehub.dto.request.AlunoLoginRequestDTO;
import com.beehub.dto.request.ProfessorLoginRequestDTO;
import com.beehub.dto.response.AdministradorResponseDTO;
import com.beehub.dto.response.AlunoLoginResponseDTO;
import com.beehub.security.SessaoValidator;
import com.beehub.service.AdministradorService;
import com.beehub.service.AlunoService;
import com.beehub.service.ProfessorService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AdministradorService administradorService;
    private final AlunoService alunoService;
    private final ProfessorService professorService;

    @PostMapping("/admin/login")
    @ResponseStatus(HttpStatus.OK)
    public AdministradorResponseDTO logarAdmin
            (@Valid @RequestBody AdministradorRequestDTO dto,
             HttpSession session){

        session.removeAttribute(SessaoValidator.ADMINISTRADOR);
        session.removeAttribute(SessaoValidator.PROFESSOR);
        session.removeAttribute(SessaoValidator.ALUNO);

        AdministradorResponseDTO admin = administradorService.loginAdmin(dto);

        session.setAttribute(
                SessaoValidator.ADMINISTRADOR,
                admin.idAdmin()
        );

        return admin;
    }

    @PostMapping("/aluno/login")
    @ResponseStatus(HttpStatus.OK)
    public AlunoLoginResponseDTO loginAluno(@Valid @RequestBody AlunoLoginRequestDTO dto,
                                            HttpSession session){

        session.removeAttribute(SessaoValidator.ADMINISTRADOR);
        session.removeAttribute(SessaoValidator.PROFESSOR);
        session.removeAttribute(SessaoValidator.ALUNO);

        AlunoLoginResponseDTO aluno = alunoService.loginAluno(dto);

        session.setAttribute(
                SessaoValidator.ALUNO,
                dto.rmAluno()
        );

        return aluno;
    }

    @PostMapping("/professor/login")
    @ResponseStatus(HttpStatus.OK)
    public UsuarioResumoDTO loginProfessor(@Valid @RequestBody ProfessorLoginRequestDTO dto,
                                           HttpSession session){

        session.removeAttribute(SessaoValidator.ADMINISTRADOR);
        session.removeAttribute(SessaoValidator.PROFESSOR);
        session.removeAttribute(SessaoValidator.ALUNO);

        UsuarioResumoDTO professor = professorService.loginProfessor(dto);

        session.setAttribute(
                SessaoValidator.PROFESSOR,
                dto.rmProfessor()
        );

        return professor;
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logoutAdmin(HttpSession session){
        session.invalidate();
    }
}

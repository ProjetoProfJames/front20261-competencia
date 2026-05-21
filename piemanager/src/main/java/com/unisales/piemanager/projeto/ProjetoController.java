package com.unisales.piemanager.projeto;

import com.unisales.piemanager.common.api.ApiResponse;
import com.unisales.piemanager.projeto.dto.ProjetoCreateRequest;
import com.unisales.piemanager.projeto.dto.ProjetoResponse;
import com.unisales.piemanager.projeto.dto.ProjetoUpdateRequest;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projetos")
public class ProjetoController {

    private final ProjetoService projetoService;

    public ProjetoController(ProjetoService projetoService) {
        this.projetoService = projetoService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ALUNO','PROFESSOR','COORDENADOR','ADMIN')")
    public ApiResponse<ProjetoResponse> create(@Valid @RequestBody ProjetoCreateRequest request,
                                               Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "system";
        return ApiResponse.success("Projeto created", projetoService.create(request, actor));
    }

    @GetMapping
    public ApiResponse<List<ProjetoResponse>> findAll(@RequestParam(required = false) Long turmaId,
                                                      @RequestParam(required = false) Long semestreId,
                                                      @RequestParam(required = false) Long localId) {
        return ApiResponse.success("Projetos fetched", projetoService.findAll(turmaId, semestreId, localId));
    }

    @GetMapping("/{id}")
    public ApiResponse<ProjetoResponse> findById(@PathVariable Long id) {
        return ApiResponse.success("Projeto fetched", projetoService.findById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('COORDENADOR','ADMIN') or " +
            "(hasRole('PROFESSOR') and @projetoService.isProfessorInProjectTurma(#id, authentication.name)) or " +
            "(hasRole('ALUNO') and @projetoService.isAlunoIntegrante(#id, authentication.name))")
    public ApiResponse<ProjetoResponse> update(@PathVariable Long id,
                                               @Valid @RequestBody ProjetoUpdateRequest request,
                                               Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "system";
        return ApiResponse.success("Projeto updated", projetoService.update(id, request, actor));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('COORDENADOR','ADMIN') or " +
            "(hasRole('PROFESSOR') and @projetoService.isProfessorInProjectTurma(#id, authentication.name)) or " +
            "(hasRole('ALUNO') and @projetoService.isAlunoIntegrante(#id, authentication.name))")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        projetoService.delete(id);
        return ApiResponse.success("Projeto deleted", null);
    }

    @PostMapping("/{id}/integrantes/me")
    @PreAuthorize("hasRole('ALUNO')")
    public ApiResponse<ProjetoResponse> addMe(@PathVariable Long id, Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "";
        return ApiResponse.success("Integrante added", projetoService.addIntegranteMe(id, actor));
    }

    @DeleteMapping("/{id}/integrantes/me")
    @PreAuthorize("hasRole('ALUNO')")
    public ApiResponse<ProjetoResponse> removeMe(@PathVariable Long id, Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "";
        return ApiResponse.success("Integrante removed", projetoService.removeIntegranteMe(id, actor));
    }
}

package com.unisales.piemanager.grupo;

import com.unisales.piemanager.common.api.ApiResponse;
import com.unisales.piemanager.grupo.dto.GrupoProjetoCreateRequest;
import com.unisales.piemanager.grupo.dto.GrupoProjetoResponse;
import com.unisales.piemanager.grupo.dto.GrupoProjetoUpdateRequest;
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
@RequestMapping("/api/grupos-projeto")
public class GrupoProjetoController {

    private final GrupoProjetoService grupoProjetoService;

    public GrupoProjetoController(GrupoProjetoService grupoProjetoService) {
        this.grupoProjetoService = grupoProjetoService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PROFESSOR','COORDENADOR','ADMIN')")
    public ApiResponse<GrupoProjetoResponse> create(@Valid @RequestBody GrupoProjetoCreateRequest request,
                                                    Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "system";
        return ApiResponse.success("Grupo de projeto created", grupoProjetoService.create(request, actor));
    }

    @GetMapping
    public ApiResponse<List<GrupoProjetoResponse>> findAll(@RequestParam(required = false) String search) {
        return ApiResponse.success("Grupos de projeto fetched", grupoProjetoService.findAll(search));
    }

    @GetMapping("/{id}")
    public ApiResponse<GrupoProjetoResponse> findById(@PathVariable Long id) {
        return ApiResponse.success("Grupo de projeto fetched", grupoProjetoService.findById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('COORDENADOR','ADMIN') or " +
            "(hasRole('PROFESSOR') and @grupoProjetoService.isProfessorOrientador(#id, authentication.name))")
    public ApiResponse<GrupoProjetoResponse> update(@PathVariable Long id,
                                                    @Valid @RequestBody GrupoProjetoUpdateRequest request,
                                                    Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "system";
        return ApiResponse.success("Grupo de projeto updated", grupoProjetoService.update(id, request, actor));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('COORDENADOR','ADMIN') or " +
            "(hasRole('PROFESSOR') and @grupoProjetoService.isProfessorOrientador(#id, authentication.name))")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        grupoProjetoService.delete(id);
        return ApiResponse.success("Grupo de projeto deleted", null);
    }
}

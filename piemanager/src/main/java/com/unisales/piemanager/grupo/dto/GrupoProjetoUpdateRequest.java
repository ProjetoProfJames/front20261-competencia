package com.unisales.piemanager.grupo.dto;

import jakarta.validation.constraints.Size;
import java.util.Set;

public class GrupoProjetoUpdateRequest {

    @Size(max = 120, message = "nome must have up to 120 chars")
    private String nome;

    private Long turmaId;

    private Long professorOrientadorId;

    private Set<Long> alunoIds;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Long getTurmaId() {
        return turmaId;
    }

    public void setTurmaId(Long turmaId) {
        this.turmaId = turmaId;
    }

    public Long getProfessorOrientadorId() {
        return professorOrientadorId;
    }

    public void setProfessorOrientadorId(Long professorOrientadorId) {
        this.professorOrientadorId = professorOrientadorId;
    }

    public Set<Long> getAlunoIds() {
        return alunoIds;
    }

    public void setAlunoIds(Set<Long> alunoIds) {
        this.alunoIds = alunoIds;
    }
}

package com.unisales.piemanager.user.dto;

import com.unisales.piemanager.user.model.Profile;
import java.time.Instant;

public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private Instant createdAt;
    private String createdBy;
    private Instant updatedAt;
    private String updatedBy;
    private Profile profile;
    private String matricula;
    private String curso;
    private Integer periodo;
    private String projeto;
    private String horarioApresentacao;
    private String localApresentacao;
    private String mesaApresentacao;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public String getCurso() { return curso; }
    public void setCurso(String curso) { this.curso = curso; }
    public Integer getPeriodo() { return periodo; }
    public void setPeriodo(Integer periodo) { this.periodo = periodo; }
    public String getProjeto() { return projeto; }
    public void setProjeto(String projeto) { this.projeto = projeto; }
    public String getHorarioApresentacao() { return horarioApresentacao; }
    public void setHorarioApresentacao(String h) { this.horarioApresentacao = h; }
    public String getLocalApresentacao() { return localApresentacao; }
    public void setLocalApresentacao(String l) { this.localApresentacao = l; }
    public String getMesaApresentacao() { return mesaApresentacao; }
    public void setMesaApresentacao(String m) { this.mesaApresentacao = m; }
}

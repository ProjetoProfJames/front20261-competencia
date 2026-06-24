package com.unisales.piemanager.user.dto;

import com.unisales.piemanager.user.model.Profile;
import jakarta.validation.constraints.Size;

public class UserUpdateRequest {

    @Size(max = 120, message = "username must have up to 120 chars")
    private String username;

    @Size(min = 6, max = 120, message = "password must be between 6 and 120 chars")
    private String password;

    private Profile profile;
    private String email;
    private String curso;
    private Integer periodo;
    private String projeto;
    private String horarioApresentacao;
    private String localApresentacao;
    private String mesaApresentacao;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
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

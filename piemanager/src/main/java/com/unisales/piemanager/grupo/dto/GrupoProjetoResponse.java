package com.unisales.piemanager.grupo.dto;

import java.time.Instant;
import java.util.List;

public class GrupoProjetoResponse {
    private Long id;
    private String nome;
    private TurmaSummary turma;
    private UserSummary professorOrientador;
    private List<UserSummary> alunos;
    private ProjetoSummary projeto;
    private Instant createdAt;
    private String createdBy;
    private Instant updatedAt;
    private String updatedBy;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public TurmaSummary getTurma() {
        return turma;
    }

    public void setTurma(TurmaSummary turma) {
        this.turma = turma;
    }

    public UserSummary getProfessorOrientador() {
        return professorOrientador;
    }

    public void setProfessorOrientador(UserSummary professorOrientador) {
        this.professorOrientador = professorOrientador;
    }

    public List<UserSummary> getAlunos() {
        return alunos;
    }

    public void setAlunos(List<UserSummary> alunos) {
        this.alunos = alunos;
    }

    public ProjetoSummary getProjeto() {
        return projeto;
    }

    public void setProjeto(ProjetoSummary projeto) {
        this.projeto = projeto;
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

    public static class TurmaSummary {
        private Long id;
        private String nome;
        private List<IdNome> cursos;
        private IdNome semestre;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getNome() {
            return nome;
        }

        public void setNome(String nome) {
            this.nome = nome;
        }

        public List<IdNome> getCursos() {
            return cursos;
        }

        public void setCursos(List<IdNome> cursos) {
            this.cursos = cursos;
        }

        public IdNome getSemestre() {
            return semestre;
        }

        public void setSemestre(IdNome semestre) {
            this.semestre = semestre;
        }
    }

    public static class ProjetoSummary {
        private Long id;
        private String nome;
        private IdNome local;
        private Instant horarioInicio;
        private Instant horarioFim;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getNome() {
            return nome;
        }

        public void setNome(String nome) {
            this.nome = nome;
        }

        public IdNome getLocal() {
            return local;
        }

        public void setLocal(IdNome local) {
            this.local = local;
        }

        public Instant getHorarioInicio() {
            return horarioInicio;
        }

        public void setHorarioInicio(Instant horarioInicio) {
            this.horarioInicio = horarioInicio;
        }

        public Instant getHorarioFim() {
            return horarioFim;
        }

        public void setHorarioFim(Instant horarioFim) {
            this.horarioFim = horarioFim;
        }
    }

    public static class IdNome {
        private Long id;
        private String nome;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getNome() {
            return nome;
        }

        public void setNome(String nome) {
            this.nome = nome;
        }
    }

    public static class UserSummary {
        private Long id;
        private String username;
        private String email;

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
    }
}

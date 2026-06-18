package com.unisales.piemanager.grupo;

import com.unisales.piemanager.common.exception.BusinessException;
import com.unisales.piemanager.common.exception.ResourceNotFoundException;
import com.unisales.piemanager.curso.model.Curso;
import com.unisales.piemanager.grupo.dto.GrupoProjetoCreateRequest;
import com.unisales.piemanager.grupo.dto.GrupoProjetoResponse;
import com.unisales.piemanager.grupo.dto.GrupoProjetoUpdateRequest;
import com.unisales.piemanager.grupo.model.GrupoProjeto;
import com.unisales.piemanager.projeto.ProjetoRepository;
import com.unisales.piemanager.projeto.model.Projeto;
import com.unisales.piemanager.turma.TurmaRepository;
import com.unisales.piemanager.turma.TurmaService;
import com.unisales.piemanager.turma.model.Turma;
import com.unisales.piemanager.user.UserRepository;
import com.unisales.piemanager.user.model.Profile;
import com.unisales.piemanager.user.model.User;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GrupoProjetoService {

    private final GrupoProjetoRepository grupoProjetoRepository;
    private final TurmaService turmaService;
    private final TurmaRepository turmaRepository;
    private final UserRepository userRepository;
    private final ProjetoRepository projetoRepository;

    public GrupoProjetoService(GrupoProjetoRepository grupoProjetoRepository,
                               TurmaService turmaService,
                               TurmaRepository turmaRepository,
                               UserRepository userRepository,
                               ProjetoRepository projetoRepository) {
        this.grupoProjetoRepository = grupoProjetoRepository;
        this.turmaService = turmaService;
        this.turmaRepository = turmaRepository;
        this.userRepository = userRepository;
        this.projetoRepository = projetoRepository;
    }

    @Transactional
    public GrupoProjetoResponse create(GrupoProjetoCreateRequest request, String actor) {
        Turma turma = turmaService.getEntityById(request.getTurmaId());
        String nome = request.getNome().trim();

        if (grupoProjetoRepository.existsByNomeIgnoreCaseAndTurmaId(nome, turma.getId())) {
            throw new BusinessException("Grupo de projeto nome already exists for this turma");
        }

        User professorOrientador = getUserById(request.getProfessorOrientadorId(), "Professor orientador not found");
        validateProfessorOrientador(turma, professorOrientador);

        Set<User> alunos = resolveAlunos(turma, request.getAlunoIds(), null);

        GrupoProjeto grupo = new GrupoProjeto();
        grupo.setNome(nome);
        grupo.setTurma(turma);
        grupo.setProfessorOrientador(professorOrientador);
        grupo.setAlunos(alunos);
        grupo.setCreatedBy(defaultActor(actor));
        grupo.setUpdatedBy(defaultActor(actor));

        return toResponse(grupoProjetoRepository.save(grupo));
    }

    @Transactional(readOnly = true)
    public List<GrupoProjetoResponse> findAll(String search) {
        String query = normalizeSearch(search);
        return grupoProjetoRepository.search(query).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public GrupoProjetoResponse findById(Long id) {
        return toResponse(getEntityById(id));
    }

    @Transactional
    public GrupoProjetoResponse update(Long id, GrupoProjetoUpdateRequest request, String actor) {
        GrupoProjeto grupo = getEntityById(id);

        Turma turma = grupo.getTurma();
        if (request.getTurmaId() != null) {
            turma = turmaService.getEntityById(request.getTurmaId());
            grupo.setTurma(turma);
        }

        String nome = grupo.getNome();
        if (request.getNome() != null && !request.getNome().isBlank()) {
            nome = request.getNome().trim();
        }

        if (grupoProjetoRepository.existsByNomeIgnoreCaseAndTurmaIdAndIdNot(nome, turma.getId(), grupo.getId())) {
            throw new BusinessException("Grupo de projeto nome already exists for this turma");
        }
        grupo.setNome(nome);

        User professorOrientador = grupo.getProfessorOrientador();
        if (request.getProfessorOrientadorId() != null) {
            professorOrientador = getUserById(request.getProfessorOrientadorId(), "Professor orientador not found");
            grupo.setProfessorOrientador(professorOrientador);
        }
        validateProfessorOrientador(turma, professorOrientador);

        if (request.getAlunoIds() != null) {
            grupo.setAlunos(resolveAlunos(turma, request.getAlunoIds(), grupo.getId()));
        } else {
            validateAlunos(grupo.getAlunos(), turma, grupo.getId());
        }

        grupo.setUpdatedBy(defaultActor(actor));
        return toResponse(grupoProjetoRepository.save(grupo));
    }

    @Transactional
    public void delete(Long id) {
        GrupoProjeto grupo = getEntityById(id);

        if (projetoRepository.existsByGrupoProjetoId(grupo.getId())) {
            throw new BusinessException("Grupo de projeto cannot be deleted because it has a linked projeto");
        }

        grupoProjetoRepository.delete(grupo);
    }

    @Transactional(readOnly = true)
    public GrupoProjeto getEntityById(Long id) {
        return grupoProjetoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo de projeto not found"));
    }

    @Transactional(readOnly = true)
    public boolean isProfessorOrientador(Long grupoId, String email) {
        return grupoProjetoRepository.existsByIdAndProfessorOrientadorEmailIgnoreCase(grupoId, normalizeEmail(email));
    }

    @Transactional(readOnly = true)
    public boolean isAlunoComponente(Long grupoId, String email) {
        return grupoProjetoRepository.existsByIdAndAlunosEmailIgnoreCase(grupoId, normalizeEmail(email));
    }

    @Transactional(readOnly = true)
    public GrupoProjetoResponse toResponse(GrupoProjeto grupo) {
        GrupoProjetoResponse response = new GrupoProjetoResponse();
        response.setId(grupo.getId());
        response.setNome(grupo.getNome());
        response.setTurma(toTurmaSummary(grupo.getTurma()));
        response.setProfessorOrientador(toUserSummary(grupo.getProfessorOrientador()));
        response.setAlunos(grupo.getAlunos().stream().map(this::toUserSummary).toList());
        response.setProjeto(projetoRepository.findByGrupoProjetoId(grupo.getId()).map(this::toProjetoSummary).orElse(null));
        response.setCreatedAt(grupo.getCreatedAt());
        response.setCreatedBy(grupo.getCreatedBy());
        response.setUpdatedAt(grupo.getUpdatedAt());
        response.setUpdatedBy(grupo.getUpdatedBy());
        return response;
    }

    private Set<User> resolveAlunos(Turma turma, Set<Long> alunoIds, Long grupoId) {
        if (alunoIds == null || alunoIds.isEmpty()) {
            throw new BusinessException("At least 3 alunos are required");
        }

        Set<User> alunos = new LinkedHashSet<>(userRepository.findAllById(alunoIds));
        if (alunos.size() != alunoIds.size()) {
            throw new ResourceNotFoundException("One or more alunos were not found");
        }

        validateAlunos(alunos, turma, grupoId);
        return alunos;
    }

    private void validateAlunos(Set<User> alunos, Turma turma, Long grupoId) {
        validateAlunoCount(alunos);

        boolean invalidProfile = alunos.stream().anyMatch(user -> user.getProfile() != Profile.ALUNO);
        if (invalidProfile) {
            throw new BusinessException("All alunoIds must have profile ALUNO");
        }

        boolean alunoNaoMatriculado = alunos.stream()
                .anyMatch(aluno -> !turmaRepository.existsByIdAndAlunosId(turma.getId(), aluno.getId()));
        if (alunoNaoMatriculado) {
            throw new BusinessException("All alunos must belong to turma");
        }

        for (User aluno : alunos) {
            boolean alreadyInAnotherGroup = grupoId == null
                    ? grupoProjetoRepository.existsAlunoEmGrupoDaTurma(turma.getId(), aluno.getId())
                    : grupoProjetoRepository.existsAlunoEmGrupoDaTurmaExcluindoGrupo(turma.getId(), aluno.getId(), grupoId);

            if (alreadyInAnotherGroup) {
                throw new BusinessException("Aluno already belongs to another grupo in turma");
            }
        }
    }

    private void validateAlunoCount(Set<User> alunos) {
        int size = alunos.size();
        if (size < 3 || size > 7) {
            throw new BusinessException("Grupo de projeto must have between 3 and 7 alunos");
        }
    }

    private void validateProfessorOrientador(Turma turma, User professorOrientador) {
        if (professorOrientador.getProfile() != Profile.PROFESSOR) {
            throw new BusinessException("professorOrientadorId must have profile PROFESSOR");
        }

        if (!turmaRepository.existsByIdAndProfessoresId(turma.getId(), professorOrientador.getId())) {
            throw new BusinessException("Professor orientador must belong to turma professores");
        }
    }

    private User getUserById(Long id, String notFoundMessage) {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(notFoundMessage));
    }

    private GrupoProjetoResponse.TurmaSummary toTurmaSummary(Turma turma) {
        GrupoProjetoResponse.TurmaSummary summary = new GrupoProjetoResponse.TurmaSummary();
        summary.setId(turma.getId());
        summary.setNome(turma.getNome());
        summary.setCursos(turma.getCursos().stream().map(this::toIdNomeCurso).toList());
        summary.setSemestre(toIdNome(turma.getSemestre().getId(), turma.getSemestre().getNome()));
        return summary;
    }

    private GrupoProjetoResponse.IdNome toIdNomeCurso(Curso curso) {
        return toIdNome(curso.getId(), curso.getNome());
    }

    private GrupoProjetoResponse.ProjetoSummary toProjetoSummary(Projeto projeto) {
        GrupoProjetoResponse.ProjetoSummary summary = new GrupoProjetoResponse.ProjetoSummary();
        summary.setId(projeto.getId());
        summary.setNome(projeto.getNome());
        summary.setLocal(toIdNome(projeto.getLocal().getId(), projeto.getLocal().getNumero()));
        summary.setHorarioInicio(projeto.getHorarioInicio());
        summary.setHorarioFim(projeto.getHorarioFim());
        return summary;
    }

    private GrupoProjetoResponse.IdNome toIdNome(Long id, String nome) {
        GrupoProjetoResponse.IdNome idNome = new GrupoProjetoResponse.IdNome();
        idNome.setId(id);
        idNome.setNome(nome);
        return idNome;
    }

    private GrupoProjetoResponse.UserSummary toUserSummary(User user) {
        GrupoProjetoResponse.UserSummary summary = new GrupoProjetoResponse.UserSummary();
        summary.setId(user.getId());
        summary.setUsername(user.getUsername());
        summary.setEmail(user.getEmail());
        return summary;
    }

    private String normalizeSearch(String search) {
        if (search == null || search.isBlank()) {
            return null;
        }
        return search.trim().toLowerCase();
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private String defaultActor(String actor) {
        return (actor == null || actor.isBlank()) ? "system" : actor;
    }
}

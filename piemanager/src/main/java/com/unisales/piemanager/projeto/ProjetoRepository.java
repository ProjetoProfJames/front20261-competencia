package com.unisales.piemanager.projeto;

import com.unisales.piemanager.projeto.model.Projeto;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjetoRepository extends JpaRepository<Projeto, Long> {

  List<Projeto> findByTurmaId(Long turmaId);

  Optional<Projeto> findByNomeIgnoreCaseAndTurmaIdAndSemestreId(String nome, Long turmaId, Long semestreId);

  List<Projeto> findBySemestreId(Long semestreId);

  List<Projeto> findByLocalId(Long localId);

  boolean existsByIdAndIntegrantesId(Long projetoId, Long userId);

  @Query("""
      select case when count(p) > 0 then true else false end
      from Projeto p
      where p.local.id = :localId
        and p.horarioInicio < :horarioFim
        and p.horarioFim > :horarioInicio
      """)
  boolean existsConflitoHorarioNoLocal(@Param("localId") Long localId,
      @Param("horarioInicio") Instant horarioInicio,
      @Param("horarioFim") Instant horarioFim);

  @Query("""
      select case when count(p) > 0 then true else false end
      from Projeto p
      where p.local.id = :localId
        and p.horarioInicio < :horarioFim
        and p.horarioFim > :horarioInicio
        and p.id <> :projetoId
      """)
  boolean existsConflitoHorarioNoLocalExcluindoProjeto(@Param("localId") Long localId,
      @Param("horarioInicio") Instant horarioInicio,
      @Param("horarioFim") Instant horarioFim,
      @Param("projetoId") Long projetoId);

  @Query("""
      select case when count(p) > 0 then true else false end
      from Projeto p
      join p.integrantes i
      where p.turma.id = :turmaId
        and p.semestre.id = :semestreId
        and i.id = :alunoId
      """)
  boolean existsAlunoEmProjetoDaTurmaSemestre(@Param("turmaId") Long turmaId,
      @Param("semestreId") Long semestreId,
      @Param("alunoId") Long alunoId);

  @Query("""
          select distinct p from Projeto p
          left join p.integrantes i
          left join p.turma t
          left join t.cursos c
          where (:turmaId is null or p.turma.id = :turmaId)
            AND (:semestreId is null or p.semestre.id = :semestreId)
            AND (:localId is null or p.local.id = :localId)
            AND (:componente is null or lower(i.username) like lower(concat('%', :componente, '%')))
            AND (:professor is null or lower(p.professorOrientador.username) like lower(concat('%', :professor, '%')))
            AND (:turmaNome is null or lower(t.nome) like lower(concat('%', :turmaNome, '%')))
            AND (:cursoNome is null or lower(c.nome) like lower(concat('%', :cursoNome, '%')))
      """)
  List<Projeto> findAllComFiltros(
      @Param("turmaId") Long turmaId,
      @Param("semestreId") Long semestreId,
      @Param("localId") Long localId,
      @Param("componente") String componente,
      @Param("professor") String professor,
      @Param("turmaNome") String turmaNome,
      @Param("cursoNome") String cursoNome);

  @Query("""
          select distinct p from Projeto p
          left join p.integrantes i
          left join p.turma t
          left join t.cursos c
          where (:componente is null or lower(i.username) like lower(concat('%', :componente, '%')))
            AND (:professor is null or lower(p.professorOrientador.username) like lower(concat('%', :professor, '%')))
            AND (:turmaNome is null or lower(t.nome) like lower(concat('%', :turmaNome, '%')))
            AND (:cursoNome is null or lower(c.nome) like lower(concat('%', :cursoNome, '%')))
      """)
  boolean existsAlunoEmProjetoDaTurmaSemestreExcluindoProjeto(@Param("turmaId") Long turmaId,
      @Param("semestreId") Long semestreId,
      @Param("alunoId") Long alunoId,
      @Param("projetoId") Long projetoId);

  boolean existsByIdAndTurmaProfessoresEmailIgnoreCase(Long projetoId, String email);

  boolean existsByIdAndIntegrantesEmailIgnoreCase(Long projetoId, String email);

  boolean existsByIdAndProfessorOrientadorEmailIgnoreCase(Long projetoId, String email);
}

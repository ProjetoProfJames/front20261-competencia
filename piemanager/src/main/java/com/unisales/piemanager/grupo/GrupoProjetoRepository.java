package com.unisales.piemanager.grupo;

import com.unisales.piemanager.grupo.model.GrupoProjeto;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GrupoProjetoRepository extends JpaRepository<GrupoProjeto, Long> {

    Optional<GrupoProjeto> findByNomeIgnoreCaseAndTurmaId(String nome, Long turmaId);

    boolean existsByNomeIgnoreCaseAndTurmaId(String nome, Long turmaId);

    boolean existsByNomeIgnoreCaseAndTurmaIdAndIdNot(String nome, Long turmaId, Long id);

    @Query("""
            select distinct g
            from GrupoProjeto g
            left join g.alunos aluno
            left join g.turma.cursos curso
            where :query is null
               or lower(g.nome) like lower(concat('%', :query, '%'))
               or lower(g.turma.nome) like lower(concat('%', :query, '%'))
               or lower(g.turma.semestre.nome) like lower(concat('%', :query, '%'))
               or lower(curso.nome) like lower(concat('%', :query, '%'))
               or lower(g.professorOrientador.username) like lower(concat('%', :query, '%'))
               or lower(g.professorOrientador.email) like lower(concat('%', :query, '%'))
               or lower(aluno.username) like lower(concat('%', :query, '%'))
               or lower(aluno.email) like lower(concat('%', :query, '%'))
            """)
    List<GrupoProjeto> search(@Param("query") String query);

    @Query("""
            select case when count(g) > 0 then true else false end
            from GrupoProjeto g
            join g.alunos aluno
            where g.turma.id = :turmaId
              and aluno.id = :alunoId
            """)
    boolean existsAlunoEmGrupoDaTurma(@Param("turmaId") Long turmaId, @Param("alunoId") Long alunoId);

    @Query("""
            select case when count(g) > 0 then true else false end
            from GrupoProjeto g
            join g.alunos aluno
            where g.turma.id = :turmaId
              and aluno.id = :alunoId
              and g.id <> :grupoId
            """)
    boolean existsAlunoEmGrupoDaTurmaExcluindoGrupo(@Param("turmaId") Long turmaId,
                                                    @Param("alunoId") Long alunoId,
                                                    @Param("grupoId") Long grupoId);

    @Query("""
            select case when count(g) > 0 then true else false end
            from GrupoProjeto g
            where g.id = :grupoId
              and lower(g.professorOrientador.email) = lower(:email)
            """)
    boolean existsByIdAndProfessorOrientadorEmailIgnoreCase(@Param("grupoId") Long grupoId,
                                                           @Param("email") String email);

    @Query("""
            select case when count(g) > 0 then true else false end
            from GrupoProjeto g
            join g.alunos aluno
            where g.id = :grupoId
              and lower(aluno.email) = lower(:email)
            """)
    boolean existsByIdAndAlunosEmailIgnoreCase(@Param("grupoId") Long grupoId, @Param("email") String email);
}

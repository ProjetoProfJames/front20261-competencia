package com.unisales.piemanager.avaliacao;

import com.unisales.piemanager.avaliacao.model.Avaliacao;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {

    List<Avaliacao> findByProjetoId(Long projetoId);

    List<Avaliacao> findByAvaliadorId(Long avaliadorId);

    boolean existsByProjetoIdAndAvaliadorId(Long projetoId, Long avaliadorId);

    boolean existsByProjetoId(Long projetoId);

    boolean existsByIdAndAvaliadorEmailIgnoreCase(Long id, String email);
}

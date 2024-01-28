package com.snup.contabilix.api.repository

import com.snup.contabilix.api.model.Contribuinte
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ContribuinteRepository: JpaRepository<Contribuinte, Long> {
    fun findByUsuarioId(usuarioId: Long): List<Contribuinte>
}
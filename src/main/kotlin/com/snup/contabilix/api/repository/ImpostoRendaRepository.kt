package com.snup.contabilix.api.repository

import com.snup.contabilix.api.model.ImpostoRenda
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ImpostoRendaRepository: JpaRepository<ImpostoRenda, Long> {
    fun findByContribuinteId(contribuinteId: Long): List<ImpostoRenda>
}
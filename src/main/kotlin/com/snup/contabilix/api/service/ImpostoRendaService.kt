package com.snup.contabilix.api.service

import com.snup.contabilix.api.model.ImpostoRenda
import com.snup.contabilix.api.repository.ImpostoRendaRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class ImpostoRendaService(private val impostoRendaRepository: ImpostoRendaRepository) {

    fun buscarTodos(): List<ImpostoRenda> {
        return impostoRendaRepository.findAll()
    }

    fun buscarPorId(id: Long): Optional<ImpostoRenda> {
        return impostoRendaRepository.findById(id)
    }

    fun buscarPorContribuinteId(contribuinteId: Long): List<ImpostoRenda> {
        return impostoRendaRepository.findByContribuinteId(contribuinteId)
    }

    fun iniciar(impostoRenda: ImpostoRenda): ImpostoRenda {
        return impostoRendaRepository.save(impostoRenda)
    }

}
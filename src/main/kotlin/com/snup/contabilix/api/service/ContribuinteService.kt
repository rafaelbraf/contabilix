package com.snup.contabilix.api.service

import com.snup.contabilix.api.model.Contribuinte
import com.snup.contabilix.api.repository.ContribuinteRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class ContribuinteService(private val contribuinteRepository: ContribuinteRepository) {

    fun buscarTodos(): List<Contribuinte> {
        return contribuinteRepository.findAll()
    }

    fun buscarPorId(id: Long): Optional<Contribuinte> {
        return contribuinteRepository.findById(id)
    }

    fun buscaPorUsuarioId(usuarioId: Long): List<Contribuinte> {
        return contribuinteRepository.findByUsuarioId(usuarioId)
    }

    fun salvar(contribuinte: Contribuinte): Contribuinte {
        return contribuinteRepository.save(contribuinte)
    }

    fun salvarTodos(contribuintes: List<Contribuinte>): List<Contribuinte> {
        return contribuinteRepository.saveAll(contribuintes)
    }

    fun deletarPorId(id: Long) {
        contribuinteRepository.deleteById(id)
    }

}
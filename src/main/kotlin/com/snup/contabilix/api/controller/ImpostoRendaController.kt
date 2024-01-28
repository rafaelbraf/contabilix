package com.snup.contabilix.api.controller

import com.snup.contabilix.api.model.ImpostoRenda
import com.snup.contabilix.api.service.ImpostoRendaService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/impostorenda")
class ImpostoRendaController(private val impostoRendaService: ImpostoRendaService) {

    @GetMapping
    fun buscarTodos(): ResponseEntity<List<ImpostoRenda>> {
        val impostosDeRenda = impostoRendaService.buscarTodos()
        return ResponseEntity.ok(impostosDeRenda)
    }

    @GetMapping("/{id}")
    fun buscarPorId(@PathVariable id: Long): ResponseEntity<Any> {
        val impostoDeRenda = impostoRendaService.buscarPorId(id)

        return if (!impostoDeRenda.isPresent) {
            ResponseEntity.status(HttpStatus.NOT_FOUND).build()
        } else {
            ResponseEntity.ok(impostoDeRenda)
        }
    }

    @GetMapping("/contribuinte/{contribuinteId}")
    fun buscarPorContribuinteId(@PathVariable contribuinteId: Long): ResponseEntity<List<ImpostoRenda>> {
        val impostosDeRenda = impostoRendaService.buscarPorContribuinteId(contribuinteId)
        return ResponseEntity.ok(impostosDeRenda)
    }

    @PostMapping
    fun iniciar(@RequestBody impostoRenda: ImpostoRenda): ResponseEntity<ImpostoRenda> {
        impostoRenda.situacaoAtual = "INICIADO"
        val impostoDeRendaIniciado = impostoRendaService.iniciar(impostoRenda)
        return ResponseEntity.ok(impostoDeRendaIniciado)
    }

}
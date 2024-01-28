package com.snup.contabilix.api.controller

import com.snup.contabilix.api.model.Contribuinte
import com.snup.contabilix.api.service.ContribuinteService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/contribuintes")
class ContribuinteController(private val contribuinteService: ContribuinteService) {

    @GetMapping
    fun buscaContribuintes(): ResponseEntity<List<Contribuinte>> {
        val contribuintes = contribuinteService.buscarTodos()
        return ResponseEntity.ok(contribuintes)
    }

    @GetMapping("/{id}")
    fun buscaContribuintePorId(@PathVariable id: Long): ResponseEntity<Any> {
        val contribuinte = contribuinteService.buscarPorId(id)

        return if (!contribuinte.isPresent) {
            ResponseEntity.notFound().build()
        } else {
            ResponseEntity.ok(contribuinte)
        }
    }

    @GetMapping("/usuario/{usuarioId}")
    fun buscaContribuintesPorUsuarioId(@PathVariable usuarioId: Long): ResponseEntity<List<Contribuinte>> {
        val contribuintes = contribuinteService.buscaPorUsuarioId(usuarioId)
        return ResponseEntity.ok(contribuintes)
    }

    @PostMapping
    fun salvar(@RequestBody contribuinte: Contribuinte): ResponseEntity<Contribuinte> {
        val contribuinteSalvo = contribuinteService.salvar(contribuinte)
        return ResponseEntity.status(HttpStatus.CREATED).body(contribuinteSalvo)
    }

    @PostMapping("/lista")
    fun salvarTodos(@RequestBody contribuintes: List<Contribuinte>): ResponseEntity<List<Contribuinte>> {
        val contribuintesSalvos = contribuinteService.salvarTodos(contribuintes)
        return ResponseEntity.status(HttpStatus.CREATED).body(contribuintesSalvos)
    }

    @DeleteMapping("/{id}")
    fun deletaPorId(@PathVariable id: Long): ResponseEntity<Void> {
        contribuinteService.deletarPorId(id)
        return ResponseEntity.noContent().build()
    }

}

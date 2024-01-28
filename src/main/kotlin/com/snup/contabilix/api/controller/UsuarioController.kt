package com.snup.contabilix.api.controller

import com.snup.contabilix.api.service.UsuarioService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/usuarios")
class UsuarioController(private val usuarioService: UsuarioService) {

    @GetMapping
    fun pegaUsuarioPeloToken(@RequestHeader("Authorization") authorizationHeader: String): ResponseEntity<Any> {
        val token = authorizationHeader.replace("Bearer ", "")
        val usuario = usuarioService.pegarPeloToken(token)

        return if (usuario == null) {
            ResponseEntity.notFound().build()
        } else {
            ResponseEntity.ok(usuario)
        }
    }

}
package com.snup.contabilix.api.controller

import com.snup.contabilix.api.model.UsuarioAutenticacaoDto
import com.snup.contabilix.api.service.UsuarioService
import com.snup.contabilix.api.utils.jwt.JwtTokenProvider
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RequestMapping("/")
@RestController
class AuthController(
    private val usuarioService: UsuarioService,
    private val jwtTokenProvider: JwtTokenProvider
) {

    @PostMapping("login")
    fun login(@RequestBody usuarioAutenticacao: UsuarioAutenticacaoDto): ResponseEntity<Map<String, String>> {
        val loginRealizado = usuarioService.login(usuarioAutenticacao)
        val token = jwtTokenProvider.gerarToken(usuarioAutenticacao.email)

        return if (loginRealizado) {
            ResponseEntity.ok(mapOf("token" to token))
        } else {
            ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(mapOf("erro" to "credenciais invalidas"))
        }
    }

    @PostMapping("registrar")
    fun registrar(@RequestBody usuarioAutenticacao: UsuarioAutenticacaoDto): ResponseEntity<Map<String, String>> {
        usuarioService.registrar(usuarioAutenticacao)
        return ResponseEntity.status(HttpStatus.CREATED).body(mapOf("mensagem" to "Usuário cadastrado com sucesso!"))
    }

}
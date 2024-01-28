package com.snup.contabilix.api.service

import at.favre.lib.crypto.bcrypt.BCrypt
import com.snup.contabilix.api.model.Usuario
import com.snup.contabilix.api.model.UsuarioAutenticacaoDto
import com.snup.contabilix.api.repository.UsuarioRepository
import com.snup.contabilix.api.utils.jwt.JwtTokenProvider
import org.springframework.stereotype.Service

@Service
class UsuarioService(
    private val usuarioRepository: UsuarioRepository,
    private val jwtTokenProvider: JwtTokenProvider
) {

    fun login(usuarioAutenticacao: UsuarioAutenticacaoDto): Boolean {
        val usuario = usuarioRepository.findByEmail(usuarioAutenticacao.email) ?: return false
        return usuario.email == usuarioAutenticacao.email && isSenhaValida(usuarioAutenticacao.senha, usuario.senha)
    }

    fun registrar(usuarioAutenticacao: UsuarioAutenticacaoDto) {
        val usuarioParaSalvar = converterDtoParaUsuario(usuarioAutenticacao)
        usuarioParaSalvar.senha = criptografarSenha(usuarioParaSalvar.senha)

        usuarioRepository.save(usuarioParaSalvar)
    }

    fun pegarPeloToken(token: String): Usuario? {
        val email = jwtTokenProvider.pegaEmailDoUsuario(token)
        return usuarioRepository.findByEmail(email)
    }

    private fun converterDtoParaUsuario(usuarioDto: UsuarioAutenticacaoDto): Usuario {
        return Usuario(null, usuarioDto.email, usuarioDto.senha)
    }

    private fun converterUsuarioParaDto(usuario: Usuario): UsuarioAutenticacaoDto {
        return UsuarioAutenticacaoDto(usuario.email, usuario.senha)
    }

    private fun criptografarSenha(senha: String): String {
        return BCrypt.withDefaults().hashToString(12, senha.toCharArray())
    }

    private fun isSenhaValida(senha: String, senhaCriptografada: String): Boolean {
        return BCrypt.verifyer().verify(senha.toCharArray(), senhaCriptografada).verified
    }

}
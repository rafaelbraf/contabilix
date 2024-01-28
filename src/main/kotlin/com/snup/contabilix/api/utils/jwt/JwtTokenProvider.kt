package com.snup.contabilix.api.utils.jwt

import io.jsonwebtoken.Jwts
import org.springframework.stereotype.Component
import java.util.*
import javax.crypto.SecretKey

@Component
class JwtTokenProvider {

    private val secretKey: SecretKey = Jwts.SIG.HS256.key().build()

    fun gerarToken(email: String): String {
        val now = Date()
        val expiredDate = Date(now.time + 100000000)

        return Jwts.builder()
            .subject(email)
            .issuedAt(now)
            .expiration(expiredDate)
            .signWith(secretKey)
            .compact()
    }

    fun isTokenValido(token: String): Boolean {
        try {
            val claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .payload

            return !claims.expiration.before(Date())
        } catch (e: Exception) {
            return false
        }
    }

    fun pegaEmailDoUsuario(token: String): String {
        try {
            val claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)

            return claims.payload.subject
        } catch (e: Exception) {
            throw RuntimeException(e)
        }
    }

}
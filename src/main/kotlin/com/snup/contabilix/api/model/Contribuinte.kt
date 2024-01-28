package com.snup.contabilix.api.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity
data class Contribuinte(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long?,

    @Column(name = "cpf")
    val cpf: String?,

    @Column(name = "nome")
    val nome: String?,

    @Column(name = "data_nascimento")
    val dataNascimento: String?,

    @Column(name = "email")
    val email: String?,

    @Column(name = "celular")
    val celular: String?,

    @Column(name = "endereco")
    val endereco: String?,

    @Column(name = "natureza_ocupacao")
    val naturezaOcupacao: String?,

    @Column(name = "ocupacao_principal")
    val ocupacaoPrincipal: String?,

    @Column(name = "usuario_id")
    val usuarioId: Long?
)
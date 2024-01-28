package com.snup.contabilix.api.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity
data class ImpostoRenda(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long?,

    @Column(name = "situacao_atual")
    var situacaoAtual: String?,

    @Column(name = "ano_referencia")
    val anoReferencia: Int?,

    @Column(name = "contribuinte_id")
    val contribuinteId: Long?
)
package com.snup.contabilix.api

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.ComponentScan

@SpringBootApplication
class ContabilixApplication

fun main(args: Array<String>) {
	runApplication<ContabilixApplication>(*args)
}

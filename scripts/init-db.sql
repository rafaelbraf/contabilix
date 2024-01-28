SELECT 'CREATE DATABASE irpf' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'irpf');

CREATE TABLE IF NOT EXISTS usuario (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS contribuinte (
    id SERIAL PRIMARY KEY,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    data_nascimento VARCHAR(11),
    email VARCHAR(255),
    celular VARCHAR(20),
    endereco VARCHAR(255),
    natureza_ocupacao VARCHAR(255),
    ocupacao_principal VARCHAR(255),
    usuario_id INTEGER NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS imposto_renda (
    id SERIAL PRIMARY KEY,
    situacao_atual VARCHAR(20) NOT NULL,
    ano_referencia INTEGER NOT NULL,
    contribuinte_id INTEGER NOT NULL,
    FOREIGN KEY (contribuinte_id) REFERENCES contribuinte(id)
);
SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS images;
CREATE TABLE images (
    id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    caption VARCHAR(255),
    size DECIMAL(10,2),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS empreendimentos;
CREATE TABLE empreendimentos (
    id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    area_cabana VARCHAR(255) NOT NULL,
    logo_id INT(11) UNSIGNED, 
    cover_id INT(11) UNSIGNED,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT 0,
    FOREIGN KEY logo_img_fk (logo_id) REFERENCES images(id) ON DELETE SET NULL,
    FOREIGN KEY cover_img_fk(cover_id) REFERENCES images(id) ON DELETE SET NULL
);

DROP TABLE IF EXISTS cabanas;
CREATE TABLE cabanas (
    id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    tamanho VARCHAR(255),
    quartos VARCHAR(255),
    valor_base DECIMAL(10,2) NOT NULL,
    disponivel BOOLEAN DEFAULT 1,
    reservada BOOLEAN DEFAULT 0,
    imagem_id INT(11),
    galeria VARCHAR(255),
    id_mapa VARCHAR(255),
    empreendimento INT(11) UNSIGNED NOT NULL,
    FOREIGN KEY empreendimento_id_fk (empreendimento) REFERENCES empreendimentos(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS cotas;
CREATE TABLE cotas (
    id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    numero INT(11) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_inicio VARCHAR(255) NOT NULL,
    data_fim VARCHAR(255) NOT NULL,
    disponivel BOOLEAN DEFAULT 1,
    reservada BOOLEAN DEFAULT 0,
    cabana INT(11) UNSIGNED,
    FOREIGN KEY cabana_fk (cabana) REFERENCES cabanas(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS infos;
CREATE TABLE infos (
    id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	nome_completo VARCHAR(255) NOT NULL,
	nacionalidade VARCHAR(255) NOT NULL,
	profissao VARCHAR(255) NOT NULL,
	data_nasc VARCHAR(255) NOT NULL,
	cpf VARCHAR(255) NOT NULL,
	rg VARCHAR(255) NOT NULL,
	orgao_exp VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS pagamentos;
CREATE TABLE pagamentos (
    id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    valor_proposta DECIMAL(10,2) NOT NULL,
    valor_final DECIMAL(10,2) NOT NULL,
    valor_parcela DECIMAL(10,2),
    n_parcelas INT(11),
    entrada DECIMAL(10,2),
    meio_pagamento VARCHAR(255)
);

DROP TABLE IF EXISTS imobiliarias;
CREATE TABLE imobiliarias (
    id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(255) NOT NULL,
    endereco VARCHAR(255),
    bairro VARCHAR(255),
    cep VARCHAR(255),
    cidade VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    estado_civil VARCHAR(255),
    creci VARCHAR(255),
    blocked BOOLEAN DEFAULT 0,
    info INT(11) UNSIGNED,
    imobiliaria INT(11) UNSIGNED,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY info_fk (info) REFERENCES infos(id) ON DELETE SET NULL,
    FOREIGN KEY imobiliaria_fk (imobiliaria) REFERENCES imobiliarias(id) ON DELETE SET NULL
);

DROP TABLE IF EXISTS propostas;
CREATE TABLE propostas (
    id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    endereco VARCHAR(255),
    bairro VARCHAR(255),
    cep VARCHAR(255),
    cidade VARCHAR(255),
    telefone VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    estado_civil VARCHAR(255),
    regime_casamento VARCHAR(255),
    comprador INT(11) UNSIGNED,
    conjuge INT(11) UNSIGNED,
    unidades JSON,
    pagamento INT(11) UNSIGNED,
    aprovada BOOLEAN DEFAULT 0,
    empreendimento INT(11) UNSIGNED NOT NULL,
    vendedor INT(11) UNSIGNED NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY comprador_fk (comprador) REFERENCES infos(id) ON DELETE CASCADE,
    FOREIGN KEY conjuge_fk (conjuge) REFERENCES infos(id) ON DELETE CASCADE,
    FOREIGN KEY pagamento_fk (pagamento) REFERENCES pagamentos(id) ON DELETE CASCADE,
    FOREIGN KEY empreendimento_fk (empreendimento) REFERENCES empreendimentos(id) ON DELETE CASCADE,
    FOREIGN KEY vendedor_fk (vendedor) REFERENCES users(id) ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS=1;
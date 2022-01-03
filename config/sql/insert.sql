/* configs */
INSERT INTO configs SET name = 'desconto_max', value = '10';
INSERT INTO configs SET name = 'entrada_min', value = '15000';
INSERT INTO configs SET name = 'representante_cf', value = '0';
INSERT INTO configs SET name = 'testemunha', value = '0';

/* default user's info */
INSERT INTO infos
    SET
        nome_completo = 'Admin Veloz';

/* default user */
INSERT INTO users
    SET
        username = 'velozadm',
        email = 'veloz@cfnegocios.com.br',
        password = 'b28c32b9a9fffb176161e8c122ce0586',
        role = 'admin',
        info = 1;
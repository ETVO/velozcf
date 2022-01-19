export * from './api';

export const errors = {
    requiredText: 'Campo obrigatório.',
    invalidDate: 'A data fornecida é inválida.',
    invalidPassword: 'Senha inválida.',
}

export const roles = {
    venda: 'Vendas',
    admin: 'Administração'
}

export const initialInfo = {
    nome_completo: '',
    nacionalidade: '',
    profissao: '',
    data_nasc: '',
    cpf: '',
    rg: '',
    orgao_exp: ''
};

export const initialPagamento = {
    valor_proposta: 0,
    valor_final: 0,
    valor_parcela: 0,
    n_parcelas: 1,
    entrada: 0,
    desconto: 0,
    meio_pagamento: 'Transferência / PIX'
};

export const initialCota = {
    numero: '',
    valor: '',
    status: 'd',
    cabana_id: 0
}

// Format number with dots between the thousands 
export function formatNumber(x, isMoney = false) {
    x = parseFloat(x);
    if(isMoney) x = x.toFixed(2)
    x = x.toString()
    x = x.replace('.', ',')
    x = x.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    return x
}

export function handleFormChange(e, fields, setFields) {
    e.preventDefault()
    let { value, id } = e.target

    fieldsChange(value, id, fields, setFields)    
}

export function fieldsChange(value, id, fields, setFields) {
    let formValues = JSON.parse(JSON.stringify(fields))

    // If there are dots in the input id, use it to 
    // assign the value to a property one-level deeper
    if (id.indexOf('.') !== -1) {
        let ids = id.split('.')
        let id1 = ids[0]
        let id2 = ids[1]

        formValues[id1][id2] = value;
    }
    // Else, just assign it normally
    else {
        formValues[id] = value;
    }

    setFields(formValues)
}

export function fieldsChangeArray(values, ids, fields, setFields) {
    let formValues = JSON.parse(JSON.stringify(fields))

    for(var i = 0; i < ids.length; i++) {
        let id = ids[i];
        
        // If there are dots in the input id, use it to 
        // assign the value to a property one-level deeper
        if (id.indexOf('.') !== -1) {
            let ids = id.split('.')
            let id1 = ids[0]
            let id2 = ids[1]

            let value = values[id1][id2];
            formValues[id1][id2] = value;
        }
        // Else, just assign it normally
        else {
            let value = values[id];
            formValues[id] = value;
        }
    }

    setFields(formValues)
}
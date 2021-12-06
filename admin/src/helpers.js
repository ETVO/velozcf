export const API_URL = process.env.REACT_APP_API_URL;

export const errors = {
    requiredText: 'Campo obrigatório.',
    invalidDate: 'A data fornecida é inválida.',
    invalidPassword: 'Senha inválida.',
}

export const roles = {
    venda: 'Vendas',
    geren: 'Gerência',
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

// Format number with dots between the thousands 
export function formatNumber(x, isMoney = false) {
    x = parseFloat(x);
    if(isMoney) x = x.toFixed(2)
    x = x.toString()
    x = x.replace('.', ',')
    x = x.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    return x
}

export async function fetchImage(id) {

    const response = await fetch(API_URL + 'imagens/read_single.php?id=' + id)

    const data = await response.json()

    return data
}

export async function authUser(username, password) {

    const response = await fetch(API_URL + '/auth', {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + btoa(username + ':' + password)
        }
    })

    const data = await response.json()

    return data
}

export async function apiReadSingle(endpoint, id) {

    const response = await fetch(API_URL + endpoint + '/read_single.php?id=' + id)

    const data = await response.json()

    return data
}

export async function apiCreate(endpoint, fields) {

    const response = await fetch(API_URL + endpoint + '/create.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fields)
    })

    const data = await response.json()

    return data
}

export async function apiUpdate(endpoint, fields) {

    const response = await fetch(API_URL + endpoint + '/update.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fields)
    })
    
    console.log(JSON.stringify(fields));

    const data = await response.json()

    return data
}

export async function apiDelete(endpoint, id) {
    const response = await fetch(API_URL + endpoint + '/delete.php', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
    })

    const data = await response.json()

    return data
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
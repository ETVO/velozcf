export const API_URL = process.env.REACT_APP_API_URL;

export const initialInfo = {
    nome_completo: '',
    nacionalidade: '',
    profissao: '',
    data_nasc: '',
    cpf: '',
    rg: '',
    orgao_exp: ''
};

export const errors = {
    requiredText: 'Campo obrigatório.',
    invalidDate: 'A data fornecida é inválida.',
    invalidPassword: 'Senha inválida.',
}

export const initialPagamento = {
    valor_proposta: 0,
    valor_final: 0,
    valor_parcela: 0,
    n_parcelas: 1,
    entrada: 0,
    meioPagamento: 'transferencia_pix'
};

/**
 * format number with dots between the thousands
 */ 
export function formatNumber(x, isMoney = false) {
    if(isMoney) x = x.toFixed(2)
    x = x.toString()
    x = x.replace('.', ',')
    x = x.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    return x
}

/**
 * fetch image data using its id
 */
export async function fetchImage(id) {

    const response = await fetch(API_URL + 'imagens/read_single.php?id=' + id)

    const data = await response.json()

    return data
}

/**
 * read single data from the api
 */
export async function apiReadSingle(endpoint, id) {

    const response = await fetch(API_URL + endpoint + '/read_single.php?id=' + id)

    const data = await response.json()

    return data
}

/**
 * read data from the api
 */
export async function apiRead(endpoint, args = '') {

    const response = await fetch(API_URL + endpoint + '/read.php' + args)

    const data = await response.json()

    return data
}


const API_URL = process.env.REACT_APP_API_URL;

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
 * read data from the api
 */
export async function apiRead(endpoint, args = '') {

    const response = await fetch(API_URL + endpoint + '/read.php' + args)

    const data = await response.json()

    return data
}
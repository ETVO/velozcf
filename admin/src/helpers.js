const API_URL = process.env.REACT_APP_API_URL

export async function fetchImage(id) {

    const response = await fetch(API_URL + 'images/read_single.php?id=' + id)

    const data = await response.json()

    if(data.success === false){
        return null
    }  

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
    let formValues = JSON.parse(JSON.stringify(fields))
    let { value, id } = e.target

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
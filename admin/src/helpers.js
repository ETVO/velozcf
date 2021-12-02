const API_URL = process.env.REACT_APP_API_URL

export async function fetchImage(id) {

    const response = await fetch(API_URL + 'images/read_single.php?id=' + id)

    const data = await response.json()

    if(data.statusCode === 400){
        return null
    }  

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
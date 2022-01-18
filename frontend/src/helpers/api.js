import md5 from 'md5'

export const API_URL = process.env.REACT_APP_API_URL;

// Interact with auth endpoint in API
export async function authUser(username, password) {

    let fields = {
        username: username,
        password: md5(password)
    }

    // Send username and md5 encrypted password to auth endpoint
    const response = await fetch(API_URL + '/auth/index.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fields)
    })

    const data = await response.json()

    return data
}


// Get string for the Authorization header's Basic token 
export function getUserSession() {

    // Get user data from localStorage
    var token = localStorage.getItem('token');

    if (!token) return null;

    // Parse decoded data (from base64 to utf8) to JSON
    var user = JSON.parse(
        Buffer.from(
            token,
            'base64'
        ).toString('utf8')
    );

    if (!user) return null;

    // Return formatted authentication string 
    return { username: user.username, password: user.password };
}

// Get string for the Authorization header's Basic token 
export function getAuthString() {

    let user = getUserSession();

    if(!user) return null;

    // Return formatted authentication string 
    return Buffer.from(user.username + ':' + user.password).toString('base64');
}

// Read single
export async function apiReadSingle(endpoint, id) {

    const response = await fetch(API_URL + endpoint + '/read_single.php?id=' + id, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + getAuthString()
        }
    })

    const data = await response.json()

    return data
}


// Read
export async function apiRead(endpoint, args = '') {

    const response = await fetch(API_URL + endpoint + '/read.php' + args, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + getAuthString()
        }
    })

    const data = await response.json()

    return data
}

// Create
export async function apiCreate(endpoint, fields, log = true) {

    const response = await fetch(API_URL + endpoint + '/create.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + getAuthString()
        },
        body: JSON.stringify(fields)
    })

    if (log)
        console.log(JSON.stringify(fields));

    const data = await response.json()

    return data
}

// Update
export async function apiUpdate(endpoint, fields, log = true) {

    const response = await fetch(API_URL + endpoint + '/update.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + getAuthString()
        },
        body: JSON.stringify(fields)
    })

    if (log)
        console.log(JSON.stringify(fields));

    const data = await response.json()

    return data
}

// Delete
export async function apiDelete(endpoint, id, log = false) {
    var body = { id: id };
    const response = await fetch(API_URL + endpoint + '/delete.php', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + getAuthString()
        },
        body: JSON.stringify(body)
    })

    if (log)
        console.log(JSON.stringify(body));

    const data = await response.json()

    return data
}

// Fetch image by id
export async function fetchImage(id) {

    const response = await fetch(API_URL + 'imagens/read_single.php?id=' + id, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + getAuthString()
        }
    })

    const data = await response.json()

    return data
}
// import React, { useState } from 'react'
// import { Form, Button, Row, Col } from 'react-bootstrap'

// // import styling
// import '../scss/Login.scss'

// const API_URL = process.env.REACT_APP_API_URL

// async function loginUser(credentials) {
//     const response = await fetch(API_URL + '/auth/local', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(credentials)
//     })

//     const data = await response.json()

//     if(data.statusCode === 400){
//         return null
//     }  

//     return data       
// }

// function Login({ setToken }) {

//     const [userInput, setUserInput] = useState()
//     const [username, setUsername] = useState()
//     const [password, setPassword] = useState()
//     const [error, setError] = useState()

//     const handleSubmit = async e => {
//         setError('')
//         e.preventDefault()

//         const token = await loginUser({
//             identifier: username,
//             password: password
//         })
//         if(token !== null) {
//             setToken(token)
//         }
//         else {
//             setError('Usuário ou senha incorretos')
//             userInput.focus()
//         }
//     }

//     return (

//         <div className="Login">
//             <Row className='p-0 w-100'>
//                 <Col lg='8' className="present p-0">
//                     <img className='cover-img d-block' src={cover.url} alt={cover.caption} />
//                 </Col>

//                 <Col lg='4' className="form d-flex p-0">
//                     <div className="my-auto form-wrap">
//                         <small className="text-danger mb-3" >{error}</small>

//                         <h1 className='text-primary'>Login</h1>

//                         <Form onSubmit={handleSubmit}>
//                             <Form.Group className='mb-3' controlId='username'>
//                                 <Form.Label>Usuário ou Email</Form.Label>
//                                 <Form.Control type='text' ref={(input => { setUserInput(input) })} onChange={e => setUsername(e.target.value)} />
//                             </Form.Group>

//                             <Form.Group className='mb-3' controlId='password'>
//                                 <Form.Label>Senha</Form.Label>
//                                 <Form.Control type='password' onChange={e => setPassword(e.target.value)} />
//                             </Form.Group>

//                             <div className="d-flex">
//                                 <div className="ms-auto">
//                                     <Button className='submit' variant='primary' type='submit'>
//                                         logar
//                                     </Button>
//                                 </div>
//                             </div>

//                         </Form>
//                     </div>
//                 </Col>
//             </Row>
//         </div>

//     )
// }
// export default Login

import React, { useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'

import { authUser } from '../helpers/helpers'

// import styling
import '../scss/Login.scss'

const defaultErrorMessage = 'Usuário ou senha incorretos.';

function Login({ setToken }) {
    const cover = {
        url: process.env.REACT_APP_BACKEND_URL + '/public/images/cover_login.png',
        caption: 'Sistema Veloz'
    }

    const [userInput, setUserInput] = useState()
    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')
    const [error, setError] = useState({ show: false, message: defaultErrorMessage })

    const handleSubmit = (e) => {
        e.preventDefault();
        setError({ show: false, message: defaultErrorMessage });

        authUser(user, pass).then(res => {
            if (res.success === false) {
                if (res.message !== '')
                    setError({ show: true, message: res.message });
                else
                    setError({ show: true });

                userInput.focus()
            }
            else {
                setToken(res);
            }
        });
    }

    return (

        <div className="Login">
            <Row className='p-0 w-100'>
                <Col lg='8' className="present p-0">
                    <img className='cover-img d-block' src={cover.url} alt={cover.caption} />
                </Col>

                <Col lg='4' className="form d-flex p-0">
                    <div className="my-auto form-wrap">

                        <small className='error text-danger mb-3' style={(!error.show) ? { opacity: 0 } : null}>
                            {error.message}
                        </small>

                        <h1 className='text-primary'>Login</h1>

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className='mb-3' controlId='username'>
                                <Form.Label>Usuário ou Email</Form.Label>
                                <Form.Control type='text' ref={(input => { setUserInput(input) })} onChange={e => setUser(e.target.value)} />
                            </Form.Group>

                            <Form.Group className='mb-3' controlId='password'>
                                <Form.Label>Senha</Form.Label>
                                <Form.Control type='password' onChange={e => setPass(e.target.value)} />
                            </Form.Group>

                            <div className="d-flex">
                                <div className="ms-auto">
                                    <Button className='submit' variant='primary' type='submit'>
                                        logar
                                    </Button>
                                </div>
                            </div>

                        </Form>
                    </div>
                </Col>
            </Row>
        </div>

    )
}

export default Login

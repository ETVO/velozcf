import React, { useState } from 'react'
import { Container, Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import md5 from 'md5'
import moment from 'moment'

import useGet from '../hooks/useGet'
import { errors } from '../helpers'

import '../scss/Home.scss'
import '../scss/View.scss'

const API_URL = process.env.REACT_APP_API_URL

const SYSTEM_URL = process.env.REACT_APP_SYSTEM_URL

function Login({ setLoggedIn }) {

    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')
    const [error, showError] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();
        showError(false);
        if (user === 'velozadm' && md5(pass) === '5172065abed82ace9fa6c180ecef364c') {
            sessionStorage.setItem('loggedIn', true)
            setLoggedIn(true);
        }
        else {
            showError(true);
        }
    }

    return (
        <div className='Login View Single d-flex h-100 flex-column bg-light'>

            <div className="wrap m-auto mb-0 bg-white">
                <div className='top-bar'></div>


                <div className="text-center mb-1">
                    <h3 className='text-muted fw-light mb-0'>Login</h3>
                    <h3 className='title mb-0'>Sistema Veloz</h3>
                </div>

                <small className='error text-danger d-block mb-2 text-center' style={(!error) ? {opacity:0} : null}>
                    Usuário ou senha incorretos.
                </small>

                <Form onSubmit={handleSubmit}>
                    <Form.Group className='form-row' controlId="user">
                        <Form.Label>Usuário</Form.Label>
                        <Form.Control onChange={(e) => setUser(e.target.value)}
                            value={user}
                            type='text'
                            // placeholder='Usuário'
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.requiredText}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='form-row' controlId="pass">
                        <Form.Label>Senha</Form.Label>
                        <Form.Control onChange={(e) => setPass(e.target.value)}
                            value={pass}
                            type='password'
                            // placeholder='Senha'
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.requiredText}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <div className="d-flex w-100">
                        <Button variant='dark' className='ms-auto' type='submit'>
                            Entrar
                        </Button>
                    </div>
                </Form>
            </div>

            <small className='text-muted mx-auto mb-auto mt-2'>{moment().format('Y')} © CF Negócios Imobiliários.</small>

        </div>
    )
}

export default Login

import React, { useState } from 'react'
import { Container, Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import md5 from 'md5'
import moment from 'moment'

import useGet from '../hooks/useGet'
import { errors, authUser } from '../helpers'

import '../scss/Home.scss'
import '../scss/View.scss'

const API_URL = process.env.REACT_APP_API_URL;

const SYSTEM_URL = process.env.REACT_APP_SYSTEM_URL;

const defaultErrorMessage = 'Usuário ou senha incorretos.';

function Login({ setToken }) {

    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')
    const [error, setError] = useState({show: false, message: defaultErrorMessage})

    const handleSubmit = (e) => {
        e.preventDefault();
        setError({show: false, message: defaultErrorMessage });

        authUser(user, pass).then(res => {
            if(res.success === false) {
                if(res.message !== '')
                    setError({show: true, message: res.message});
                else 
                    setError({show: true});
            }
            else {
                // console.log(res);
                setToken(res);
            }
        });
    }

    return (
        <div className='Login View Single d-flex h-100 flex-column bg-light'>

            <div className="wrap m-auto mb-0 bg-white">
                <div className='top-bar'></div>


                <div className="text-center">
                    <h1 className='text-muted fw-light mb-0'>Login</h1>
                    <h2 className='title mb-0'>Sistema Veloz</h2>
                </div>

                <small className='error text-danger d-block my-1 text-center' style={(!error.show) ? {opacity:0} : null}>
                    {error.message}
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

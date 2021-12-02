import React, { useState } from 'react'
import { Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import '../scss/View.scss'

const API_URL = process.env.REACT_APP_API_URL

export default function Users() {

    return (
        <Container className='Users my-5 col-xl-9'>
            <h1 className='title'>Usuários</h1>

        </Container>
    )
}

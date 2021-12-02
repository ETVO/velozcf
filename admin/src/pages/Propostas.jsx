import React, { useState } from 'react'
import { Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import '../scss/View.scss'

const API_URL = process.env.REACT_APP_API_URL

export default function Propostas() {

    return (
        <Container className='Propostas my-5'>
            <h1 className='title'>Propostas</h1>

        </Container>
    )
}

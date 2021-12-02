import React, { useState } from 'react'
import { Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import '../scss/View.scss'

const API_URL = process.env.REACT_APP_API_URL

export default function Imobiliarias() {

    return (
        <Container className='Imobiliarias my-5 col-xl-9'>
            <h1 className='title'>Imobiliarias</h1>

        </Container>
    )
}

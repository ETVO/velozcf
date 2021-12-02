import React, { useState } from 'react'
import { Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import '../scss/Home.scss'

const SYSTEM_URL = process.env.REACT_APP_SYSTEM_URL

function Home() {

    return (
        <Container className='Home View my-5'>
            <h1 className='title mb-0'>Sistema Veloz</h1>
            <h3 className='text-muted fw-light'>Painel de Administração</h3>

            <p className='home-options'>
                Opções:
                <ul>
                    <li>
                        <Link to='/empreendimentos'>Empreendimentos</Link>
                    </li>
                    <li>
                        <Link to='/propostas'>Propostas</Link>
                    </li>
                    <li>
                        <Link to='/users'>Usuários</Link>
                    </li>
                    <li>
                        <Link to='/imobiliarias'>Imobiliárias</Link>
                    </li>
                    <li>
                        <Link to='/settings'>Configurações</Link>
                    </li>
                </ul>
                <a href={SYSTEM_URL}><span className='bi-arrow-left'></span> Voltar ao Sistema</a>
            </p>

        </Container>
    )
}

export default Home

import React, { useState } from 'react'
import { Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import useGet from '../hooks/useGet'

import '../scss/Home.scss'

const API_URL = process.env.REACT_APP_API_URL

const SYSTEM_URL = process.env.REACT_APP_SYSTEM_URL

function Home() {


    const { loading, error, data } = useGet(API_URL + 'empreendimentos/read.php')

    return (
        <Container className='Home View my-5'>
            <h1 className='title mb-0'>Sistema Veloz</h1>
            <h3 className='text-muted fw-light'>Painel de Administração</h3>

            <div className='home-options mb-3'>
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
            </div>

            <div className='home-diag'>
                Conexão Banco de Dados:&nbsp;
                {(loading) ? (
                    <span className='text-muted'>Carregando...</span>
                ) : (error) ? (
                    <span>
                        <span className='text-danger fw-bold'>ERRO</span>
                        <br />
                        <small className='text-danger'>Detalhes: {error.message}</small>
                    </span>
                ) : (
                    <span className='text-green fw-bold'>OK</span>
                )}
            </div>

        </Container>
    )
}

export default Home

import React, { useState } from 'react'
import { Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import useGet from '../hooks/useGet'

import '../scss/View.scss'

const API_URL = process.env.REACT_APP_API_URL

export default function Users() {
    const { loading, error, data } = useGet(API_URL + '/images/read.php')

    if (loading) return (
        <Container className='Users View my-5'>
            <p>Carregando...</p>
        </Container>
    );
    if (error) return (
        <Container className='Users View my-5'>
            <p>Erro ao carregar.</p>
        </Container>
    );

    return (
        <Container className='Users my-5'>
            <h1 className='title'>Usuários</h1>
            <small className='text-muted'>AVISO SISTEMA VELOZ:</small>
            <p>O seu usuário não tem permissão para acessar esta página.</p>
        </Container>
    )
}

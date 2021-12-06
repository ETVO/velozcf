import React, { useState } from 'react'
import { Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import useGet from '../hooks/useGet';

import '../scss/Empreendimentos.scss';

const API_URL = process.env.REACT_APP_API_URL;

const endpoint = 'empreendimentos';

function Empreendimentos() {

    const { loading, error, data } = useGet(API_URL + endpoint + '/read.php?deleted=0');

    if(loading) {
        return (
            <div className='Empreendimentos d-flex h-100'>
                <p className='m-auto'>Carregando...</p>
            </div>
        ) 
    }
    if(error) {
        return (
            <div className='Empreendimentos d-flex h-100'>
                <p className='m-auto'>Ocorreu um erro ao carregar a página.</p>
            </div>
        )
    }


    return (
        <Container className='Empreendimentos mt-5 col-xl-9'>
            <h1 className='title'>Bem vindo!</h1>

            <h5 className='mt-4 mb-3 fw-normal text-secondary'>Empreendimentos:</h5>

            {(data.success !== false) ? data.data.map(emp => (
                <Link key={emp.id} to={'/empreendimento/' + emp.id}>
                    <div className='emp-card'>
                        <img className='cover' src={emp.cover.url} />

                        <div className="overlay">
                            <div className="logo">
                                <img src={emp.logo.url} alt="" />
                            </div>
                            <div className="button">
                                <Button className='d-flex'>
                                    vender
                                    <span className='ms-1 bi bi-chevron-right'></span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </Link>
            )) : data.message}

        </Container>
    )
}

export default Empreendimentos

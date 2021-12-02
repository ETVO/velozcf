import React, { useState } from 'react'
import { Container, Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import moment from 'moment'

import useGet from '../hooks/useGet'
import useDelete from '../hooks/useDelete'

import '../scss/View.scss'

const API_URL = process.env.REACT_APP_API_URL

async function deleteEmpre(id) {
    
    if(window.confirm('Deseja realmente excluir este empreendimento?')) {
        const response = await fetch(API_URL + 'empreendimentos/delete.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: id})
        })
    
        const data = await response.json()

        alert(data.message)

        window.location.href = ''
    }
}

function Empreendimentos() {
    const { loading, error, data } = useGet(API_URL + 'empreendimentos/read.php')

    if (loading) return (
        <Container className='Empreendimentos View my-5'>
            <p>Carregando...</p>
        </Container>
    );
    if (error) return (
        <Container className='Empreendimentos View my-5'>
            <p>Erro ao carregar.</p>
        </Container>
    );

    return (
        <Container className='Empreendimentos View my-5'>
            <div className="d-flex flex-column flex-md-row heading">
                <div className="d-flex m-auto ms-md-0">
                    <h1 className='title'>Empreendimentos</h1>
                    <span className='m-auto ms-3'>
                        <a className='icon reload' title='Recarregar' href=''>
                            <span className='bi-arrow-clockwise'></span>
                        </a>
                    </span>
                </div>
                <span className='m-auto me-md-0'>
                    <Button variant='outline-dark' className='d-flex' as={Link} to='/empreendimento'>
                        Adicionar Novo
                    </Button>
                </span>
            </div>
            
            {(data.data) ? <Table responsive className='mt-3'>
                <thead>
                    <tr>
                        <th></th>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Última modificação</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.data.map(item => {

                        let updatedAt = moment(item.updated_at).format('DD/MM/YYYY HH:mm')

                        return (
                            <tr key={item.id} className={(item.deleted == 1) ? 'deleted' : ''}>
                                <td className='logo'><img src={item.logo.url} alt="" /></td>
                                <td>{item.id}</td>
                                <td>{item.nome}</td>
                                <td className='updatedAt'>{updatedAt}</td>
                                <td className='actions'>
                                    <Link 
                                        className='text-primary bi bi-pencil-fill' 
                                        to={'/empreendimento/' + item.id}>
                                    </Link>
                                    &nbsp;&nbsp;
                                    <span 
                                        className='text-danger bi bi-trash-fill' 
                                        onClick={() => { deleteEmpre(item.id) }}>
                                    </span>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table> : 'Nenhum empreendimento foi encontrado.' }
        </Container>
    )
}

export default Empreendimentos

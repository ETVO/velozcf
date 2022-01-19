import React, { useState } from 'react'
import { Form, Container, Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import moment from 'moment'

import useGet from '../hooks/useGet'
import { apiDelete, apiReadSingle, formatNumber, roles } from '../helpers/helpers'

import ViewHeading from '../components/ViewHeading'

import '../scss/View.scss'

const API_URL = process.env.REACT_APP_API_URL

const singleLink = '/proposta/'
const endpoint = 'propostas'

async function deleteProposta(id) {
    if (window.confirm('AÇÃO IRREVERSÍVEL!\nDeseja realmente excluir este registro PERMANENTEMENTE?')) {
        apiDelete(endpoint, id).then(res => {
            alert(res.message);
            window.location.reload();
        })
    }
}

function Propostas() {
    const { loading, error, data } = useGet(API_URL + endpoint + '/read.php')

    if (loading) return (
        <Container className='Propostas View my-5'>
            <p>Carregando...</p>
        </Container>
    );
    if (error) return (
        <Container className='Propostas View my-5'>
            <p>Erro ao carregar.</p>
        </Container>
    );

    return (
        <Container className='Propostas View my-5'>
            <ViewHeading showReload={true} title='Propostas' addNew='Adicionar Nova' addNewLink={singleLink} />

            {(data.data) ? <Table responsive className='mb-3'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Corretor (#)</th>
                        <th>Comprador (CPF)</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.data.map(item => {

                        return (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td><b>{item.vendedor.nome_completo}</b> (#{item.vendedor.id})</td>
                                <td><b>{item.comprador.nome_completo}</b> ({item.comprador.cpf})</td>
                                <td className={'fw-bold ' + ((!item.aprovada) ? 'text-danger' : 'text-green')}>
                                    {(!item.aprovada) ? 'Pendente' : 'Aprovada'}
                                </td>
                                <td className='actions'>
                                    <div>
                                        <Link
                                            title='Visualizar'
                                            className='text-primary bi bi-eye-fill'
                                            to={singleLink + item.id}>
                                        </Link>
                                        &nbsp;&nbsp;
                                        <span
                                            title='Excluir permanentemente'
                                            className='text-danger bi bi-x-circle-fill'
                                            onClick={() => { deleteProposta(item.id, true) }}>
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table> : data.message}
        </Container>
    )
}

export default Propostas

import React, { useState } from 'react'
import { Form, Container, Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import moment from 'moment'

import useGet from '../hooks/useGet'
import { apiDelete, apiReadSingle, formatNumber, roles } from '../helpers'

import ViewHeading from '../components/ViewHeading'

import '../scss/View.scss'

const API_URL = process.env.REACT_APP_API_URL

const singleLink = '/imobiliaria/'
const endpoint = 'imobiliarias'

async function deleteImobiliaria(id) {

    if (window.confirm('AÇÃO IRREVERSÍVEL!\nDeseja realmente excluir este registro PERMANENTEMENTE?')) {
        apiDelete(endpoint, id).then(res => {
            alert(res.message);
            window.location.reload();
        })
    }

}

function Imobiliarias() {
    const { loading, error, data } = useGet(API_URL + endpoint + '/read.php')

    if (loading) return (
        <Container className='Imobiliarias View my-5'>
            <p>Carregando...</p>
        </Container>
    );
    if (error) return (
        <Container className='Imobiliarias View my-5'>
            <p>Erro ao carregar.</p>
        </Container>
    );

    return (
        <Container className='Imobiliarias View my-5'>
            <ViewHeading showReload={true} title='Imobiliárias' addNew='Adicionar Nova' addNewLink={singleLink} />

            {(data.data) ? <Table responsive className='mb-3'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>CNPJ</th>
                        <th>Nº Vendedores</th>
                        <th>Última atualização</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.data.map(item => {

                        let updatedAt = moment(item.updated_at).format('DD/MM/YYYY HH:mm');

                        return (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.nome}</td>
                                <td>{item.cnpj}</td>
                                <td>{item.user_count}</td>
                                <td className='updatedAt d-none d-sm-table-cell'>{updatedAt}</td>
                                <td className='actions'>
                                    <div>
                                        <Link
                                            title='Editar'
                                            className='text-primary bi bi-pencil-fill'
                                            to={singleLink + item.id}>
                                        </Link>
                                        &nbsp;&nbsp;
                                        <span
                                            title='Excluir permanentemente'
                                            className='text-danger bi bi-x-circle-fill'
                                            onClick={() => { deleteImobiliaria(item.id, true) }}>
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table> : 'Nenhuma cabana foi encontrada.'}
        </Container>
    )
}

export default Imobiliarias

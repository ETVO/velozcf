import React, { useState } from 'react'
import { Form, Container, Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import moment from 'moment'

import useGet from '../hooks/useGet'
import { apiDelete, apiUpdate, apiReadSingle, formatNumber, roles } from '../helpers'

import ViewHeading from '../components/ViewHeading'

import '../scss/View.scss'

const API_URL = process.env.REACT_APP_API_URL

const singleLink = '/user/'
const endpoint = 'users'

async function deleteUser(id) {

    if (window.confirm('AÇÃO IRREVERSÍVEL!\nDeseja realmente excluir este registro PERMANENTEMENTE?')) {
        apiDelete(endpoint, id).then(res => {
            alert(res.message);
            window.location.reload();
        })
    }
}

async function blockUser(id) {
    if (window.confirm('Deseja realmente bloquear este usuário?')) {
        apiUpdate(endpoint, {
            id: id,
            blocked: 1
        }).then(res => {
            alert(res.message);
            window.location.reload()
        })
    }
}

async function unblockUser(id) {
    if (window.confirm('Deseja realmente desbloquear este usuário?')) {
        apiUpdate(endpoint, {
            id: id,
            blocked: 0
        }).then(res => {
            alert(res.message);
            window.location.reload()
        })
    }
}

function Users() {
    const { loading, error, data } = useGet(API_URL + endpoint + '/read.php')

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
        <Container className='Users View my-5'>
            <ViewHeading showReload={true} title='Usuários' addNew='Adicionar Novo' addNewLink={singleLink} />

            {(data.data) ? <Table responsive className='mb-3'>
                <thead>
                    <tr>
                        {/* <th></th> */}
                        <th>#</th>
                        <th>Usuário</th>
                        <th>Nome</th>
                        <th>Categoria</th>
                        <th>Imobiliária</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.data.map(item => {


                        return (
                            <tr key={item.id}>
                                {/* <td className='photo'>
                                    <Link to={singleLink + item.id}>
                                        <img src={item.photo.url} alt="" />
                                    </Link>
                                </td> */}
                                <td>{item.id}</td>
                                <td>{item.username}</td>
                                <td>{item.nome_completo}</td>
                                <td>{roles[item.role]}</td>
                                <td>{item.imobiliaria.nome}</td>
                                <td className={'fw-bold ' + ((item.blocked) ? 'text-danger' : 'text-green')}>
                                    {(item.blocked) ? 'Bloqueado' : 'Ativo'}
                                </td>
                                <td className='actions'>

                                    {(item.blocked != 1) ? (
                                        <div>
                                            <Link
                                                title='Editar'
                                                className='text-primary bi bi-pencil-fill'
                                                to={singleLink + item.id}>
                                            </Link>
                                            &nbsp;&nbsp;

                                            {(item.id !== 1) ? 
                                            <span
                                                title='Bloquear'
                                                className='text-danger bi bi-lock-fill'
                                                onClick={() => { blockUser(item.id) }}>
                                            </span> : 
                                            <span
                                                title='Este usuário não pode ser bloqueado'
                                                className='text-danger icon-disabled bi bi-lock-fill'
                                                onClick={(e) => { alert(e.target.getAttribute('title')) }}>
                                            </span> } 

                                        </div>
                                    ) : (
                                        
                                        <div>
                                            <span
                                                title='Desbloquear'
                                                className='text-primary bi bi-unlock-fill'
                                                onClick={() => { unblockUser(item.id) }}>
                                            </span>
                                            &nbsp;&nbsp;
                                            <span
                                                title='Excluir permanentemente'
                                                className='text-danger bi bi-x-circle-fill'
                                                onClick={() => { deleteUser(item.id, true) }}>
                                            </span>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table> : data.message }
        </Container>
    )
}

export default Users

import React, { useState } from 'react'
import { Container, Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import moment from 'moment'

import useGet from '../hooks/useGet'
import { apiDelete, apiUpdate } from '../helpers'

import '../scss/View.scss'

const API_URL = process.env.REACT_APP_API_URL

async function deleteEmpre(id, permanently = false) {

    if(!permanently) {
        if (window.confirm('Deseja realmente excluir este registro?')) {
            apiUpdate('empreendimentos', {
                id: id,
                deleted: 1
            }).then(res => {
                alert(res.message);
                window.location.href = ''
            })
        }
    }
    else {
        if (window.confirm('AÇÃO IRREVERSÍVEL!\nDeseja realmente excluir este registro PERMANENTEMENTE?')) {
            apiDelete('empreendimentos', id).then(res => {
                alert(res.message);
                window.location.href = ''
            })
        }
    }

}

async function recoverEmpre(id) {

    apiUpdate('empreendimentos', {
        id: id,
        deleted: 0
    }).then(res => {
        if(res.success === false) {
            alert(res.message)
        }
        window.location.href = ''
    })
}

function Empreendimentos() {
    const { loading, error, data } = useGet(API_URL + 'empreendimentos/read.php')

    const [showDeleted, setDeletedShow] = useState(false)

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
                <div className="d-flex flex-column flex-sm-row m-auto ms-md-0">
                    <h1 className='title'>Empreendimentos</h1>
                    <span className='m-auto ms-sm-3'>
                        <a className='icon reload d-none d-sm-block' title='Recarregar' href=''>
                            <span className='mx-auto bi-arrow-clockwise'></span>
                        </a>
                    </span>
                    <small className='m-auto ms-sm-2 cursor-pointer'>
                        <span className={(showDeleted) ? 'text-decoration-underline' : 'text-muted'} onClick={() => { setDeletedShow(!showDeleted) }}>
                            Ver Excluídos
                        </span>
                    </small>
                </div>
                <span className='m-auto mt-2 mt-sm-auto me-md-0'>
                    <Button variant='outline-dark' className='d-flex' as={Link} to='/empreendimento'>
                        Adicionar Novo
                    </Button>
                </span>
            </div>

            {(data.data) ? <Table responsive className={(showDeleted) ? 'mb-3 show-deleted' : 'mb-3'}>
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
                                <td>#{item.id}</td>
                                <td>{item.nome}</td>
                                <td className='updatedAt'>{updatedAt}</td>
                                <td className='actions'>

                                    {(item.deleted != 1) ? (
                                        <div>
                                            <Link
                                                title='Editar'
                                                className='text-primary bi bi-pencil-fill'
                                                to={'/empreendimento/' + item.id}>
                                            </Link>
                                            &nbsp;&nbsp;
                                            <span
                                                title='Excluir'
                                                className='text-danger bi bi-trash-fill'
                                                onClick={() => { deleteEmpre(item.id) }}>
                                            </span>
                                        </div>
                                    ) : (
                                        
                                        <div>
                                            <span
                                                title='Recuperar'
                                                className='text-primary bi bi-check-circle-fill'
                                                onClick={() => { recoverEmpre(item.id) }}>
                                            </span>
                                            &nbsp;&nbsp;
                                            <span
                                                title='Excluir permanentemente'
                                                className='text-danger bi bi-x-circle-fill'
                                                onClick={() => { deleteEmpre(item.id, true) }}>
                                            </span>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table> : 'Nenhum empreendimento foi encontrado.'}
        </Container>
    )
}

export default Empreendimentos

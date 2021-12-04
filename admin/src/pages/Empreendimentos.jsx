import React, { useState } from 'react'
import { Container, Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import moment from 'moment'

import useGet from '../hooks/useGet'
import { apiDelete, apiUpdate } from '../helpers'

import ViewHeading from '../components/ViewHeading'

import '../scss/View.scss'

const API_URL = process.env.REACT_APP_API_URL

const singleLink = '/empreendimento/'
const endpoint = 'empreendimentos'

async function deleteEmpre(id, permanently = false) {

    if(!permanently) {
        if (window.confirm('Deseja realmente excluir este registro?')) {
            apiUpdate(endpoint, {
                id: id,
                deleted: 1
            }).then(res => {
                alert(res.message);
                window.location.reload()
            })
        }
    }
    else {
        if (window.confirm('AÇÃO IRREVERSÍVEL!\nDeseja realmente excluir este registro PERMANENTEMENTE?')) {
            apiDelete(endpoint, id).then(res => {
                alert(res.message);
                window.location.reload()
            })
        }
    }

}

async function recoverEmpre(id) {

    apiUpdate(endpoint, {
        id: id,
        deleted: 0
    }).then(res => {
        if(res.success === false) {
            alert(res.message)
        }
        window.location.reload()
    })
}

function Empreendimentos() {
    const { loading, error, data } = useGet(API_URL + endpoint + '/read.php')

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
            <ViewHeading showReload={true} title='Empreendimentos' addNew='Adicionar Novo' addNewLink={singleLink} />
            
            <small className='m-auto cursor-pointer d-block mt-2 mt-md-0'>
                <span className={(showDeleted) ? 'text-decoration-underline' : 'text-muted'} onClick={() => { setDeletedShow(!showDeleted) }}>
                    Ver Excluídos
                </span>
            </small>

            {(data.data) ? <Table responsive className={(showDeleted) ? 'mb-3 show-deleted' : 'mb-3'}>
                <thead>
                    <tr>
                        <th className='d-none d-sm-table-cell'></th>
                        <th>ID</th>
                        <th>Nome</th>
                        <th className='d-none d-sm-table-cell'>Última modificação</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.data.map(item => {

                        let updatedAt = moment(item.updated_at).format('DD/MM/YYYY HH:mm')

                        return (
                            <tr key={item.id} className={(item.deleted == 1) ? 'deleted' : ''}>
                                <td className='logo d-none d-sm-table-cell'><Link to={singleLink + item.id}><img src={item.logo.url} alt="" /></Link></td>
                                <td>#{item.id}</td>
                                <td>{item.nome}</td>
                                <td className='updatedAt d-none d-sm-table-cell'>{updatedAt}</td>
                                <td className='actions'>

                                    {(item.deleted != 1) ? (
                                        <div>
                                            <Link
                                                title='Editar'
                                                className='text-primary bi bi-pencil-fill'
                                                to={singleLink + item.id}>
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

import React, { useState } from 'react'
import { Form, Container, Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import moment from 'moment'

import useGet from '../hooks/useGet'
import { apiDelete, apiReadSingle, formatNumber } from '../helpers'

import ViewHeading from '../components/ViewHeading'

import '../scss/View.scss'

const API_URL = process.env.REACT_APP_API_URL

const singleLink = '/cabana/'
const endpoint = 'cabanas'

async function deleteCabana(id) {
    
    if (window.confirm('AÇÃO IRREVERSÍVEL!\nDeseja realmente excluir este registro PERMANENTEMENTE?')) {
        apiDelete(endpoint, id).then(res => {
            alert(res.message);
            window.location.href = ''
        })
    }

}

async function getEmpres() {

    const response = await fetch(API_URL + 'empreendimentos/read.php')

    const data = await response.json()

    return data
}


function Cabanas() {
    const { loading, error, data } = useGet(API_URL + endpoint + '/read.php')
    
    const [empres, setEmpres] = useState([]);
    const [filter, setFilter] = useState('');

    (async () => {
        if(empres.length === 0) {
            setEmpres(await getEmpres());
        }
    })()

    if (loading) return (
        <Container className='Cabanas View my-5'>
            <p>Carregando...</p>
        </Container>
    );
    if (error) return (
        <Container className='Cabanas View my-5'>
            <p>Erro ao carregar.</p>
        </Container>
    );

    const changeFilterEmpre = (e) => {
        let { value } = e.target;

        setFilter(value)

        console.log(value)
    }

    return (
        <Container className='Cabanas View my-5'>
            <ViewHeading showReload={true} title='Cabanas' addNew='Adicionar Novo' addNewLink={singleLink} />
            
            <small className='m-auto ms-sm-2 d-block cursor-pointer'>
                {(empres) ? (
                    <Form.Select className='smaller filter-select' onChange={changeFilterEmpre}>
                        <option value=''>Filtrar empreendimentos</option>
                        {(empres.data) ? empres.data.map(empre => {
                            return(
                                <option key={empre.id} value={empre.id}>{empre.nome}</option>
                            );
                        }) : ''}
                    </Form.Select>
                ) : 'Nenhum empreendimento encontrado.'}
            </small>

            {(data.data) ? <Table responsive className='mb-3'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Empreendimento</th>
                        <th>Valor base</th>
                        <th>Nº Cotas</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.data.map(item => {
                        
                        let hide = (filter !== '' && item.empreendimento.id != filter)

                        return (
                            <tr key={item.id} className={(hide) ? 'd-none' : ''}>
                                <td>#{item.id}</td>
                                <td>{item.nome}</td>
                                <td>{item.empreendimento.nome}</td>
                                <td>{'R$ ' + formatNumber(item.valor_base, true)}</td>
                                <td>{8}</td>
                                <td className={'fw-bold ' + ((item.disponivel) ? ((item.reservada) ? 'text-warning' : 'text-green') : 'text-danger')}>
                                    {(item.disponivel) ? ((item.reservada) ? 'Reservada' : 'Disponível') : 'Vendida'}
                                </td>
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
                                            onClick={() => { deleteCabana(item.id, true) }}>
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

export default Cabanas

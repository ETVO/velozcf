import React, { useState } from 'react'
import { Form, Container, Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import moment from 'moment'

import useGet from '../hooks/useGet'
import { apiDelete, apiReadSingle, formatNumber } from '../helpers/helpers'

import ViewHeading from '../components/ViewHeading'

import '../scss/View.scss'

const API_URL = process.env.REACT_APP_API_URL

const singleLink = '/cabana/'
const singleEmpreLink = '/empreendimento/'
const endpoint = 'cabanas'

async function deleteCabana(id) {

    if (window.confirm('AÇÃO IRREVERSÍVEL!\nDeseja realmente excluir este registro PERMANENTEMENTE?')) {
        apiDelete(endpoint, id).then(res => {
            alert(res.message);
            window.location.reload();
        })
    }

}


function Cabanas() {
    const { loading, error, data } = useGet(API_URL + endpoint + '/read.php')

    const [empres, setEmpres] = useState([]);
    const [filter, setFilter] = useState('');

    // (async () => {
    //     if (empres.length === 0) {
    //         setEmpres(await getEmpres());
    //     }
    // })()

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
            <ViewHeading showReload={true} title='Cabanas' addNew='Adicionar Nova' addNewLink={singleLink} />


            {(data.data) ?
                <div>
                    {/* <small className='m-auto cursor-pointer d-flex mt-2 m-md-0 mb-2'>
                        {(empres) ? (
                            <Form.Select className='smaller filter-select' onChange={changeFilterEmpre}>
                                <option value=''>Filtrar empreendimentos</option>
                                {(empres.data) ? empres.data.map(empre => {
                                    return (
                                        <option key={empre.id} value={empre.id}>{empre.nome}</option>
                                    );
                                }) : ''}
                            </Form.Select>
                        ) : 'Nenhum empreendimento encontrado.'}
                    </small> */}
                    <Table responsive className='mb-3'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Imagem</th>
                                <th>Número</th>
                                <th>Empreendimento</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.data.map(item => {

                                let hide = (filter !== '' && item.empreendimento.id != filter)

                                return (
                                    <tr key={item.id} className={(hide) ? 'd-none' : ''}>
                                        <td className='id'>#{item.id}</td>
                                        <td className='square-image'><img src={item.imagem.url} alt={item.imagem.caption} /></td>
                                        <td>{item.numero}</td>
                                        <td>
                                            <Link to={singleEmpreLink + item.empreendimento.id}
                                                target="_blank" rel="noopener noreferrer"
                                                title='Ver empreendimento'
                                                className='text-decoration-none'
                                            >
                                                {item.empreendimento.nome} <span className='smaller bi-arrow-up-right'></span>
                                            </Link>
                                        </td>
                                        <td className={'fw-bold ' + ((item.disponivel) ? 'text-green' : 'text-danger')}>
                                            {(item.disponivel) ? 'Disponível' : 'Indisponível'}
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
                    </Table>
                </div> : data.message}
        </Container>
    )
}

export default Cabanas

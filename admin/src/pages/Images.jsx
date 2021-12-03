import React, { useState } from 'react'
import { Container, Button, Row, Col, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import moment from 'moment'

import useGet from '../hooks/useGet'
import { apiDelete, apiUpdate } from '../helpers'

import '../scss/View.scss'

const API_URL = process.env.REACT_APP_API_URL

const singleLink = '/image'
const endpoint = 'images'

async function deleteImage(id, permanently = false) {

    if (window.confirm('AÇÃO IRREVERSÍVEL!\nDeseja realmente excluir esta imagem PERMANENTEMENTE?')) {
        apiDelete(endpoint, id).then(res => {
            alert(res.message);
            window.location.href = ''
        })
    }

}

function Images() {
    const { loading, error, data } = useGet(API_URL + endpoint + '/read.php')

    const [showDeleted, setDeletedShow] = useState(false)

    if (loading) return (
        <Container className='Images View my-5'>
            <p>Carregando...</p>
        </Container>
    );
    if (error) return (
        <Container className='Images View my-5'>
            <p>Erro ao carregar.</p>
        </Container>
    );

    

    return (
        <Container className='Images View my-5'>
            <div className="d-flex flex-column flex-md-row heading">
                <div className="d-flex flex-column flex-sm-row m-auto ms-md-0">
                    <h1 className='title'>Imagens</h1>
                    <span className='m-auto ms-sm-3'>
                        <a className='icon reload d-none d-sm-block' title='Recarregar' href=''>
                            <span className='mx-auto bi-arrow-clockwise'></span>
                        </a>
                    </span>
                </div>
                <span className='m-auto mt-2 mt-sm-auto me-md-0'>
                    <Button variant='outline-dark' className='d-flex' as={Link} to={singleLink}>
                        Adicionar Nova
                    </Button>
                </span>
            </div>

            {(data.data) ?
                <Row className='mb-3' xs={2} md={4} lg={5} xl={6}>
                    {data.data.map(item => {

                        let updatedAt = moment(item.updated_at).format('DD/MM/YYYY HH:mm')

                        return (

                            <Col key={item.id}>
                                <Card>
                                    <Link to={singleLink + '/' + item.id}>
                                    <Card.Img 
                                        variant="top" 
                                        src={item.url} />
                                    </Link>

                                    <Card.Body className='d-flex'>
                                        <div className='actions m-auto'>
                                            <Link
                                                title='Editar'
                                                className='text-primary bi bi-pencil-fill'
                                                to={singleLink + '/' + item.id}>
                                            </Link>
                                            &nbsp;&nbsp;
                                            <span
                                                title='Excluir'
                                                className='text-danger bi bi-trash-fill'
                                                onClick={() => { deleteImage(item.id) }}>
                                            </span>
                                        </div>
                                    </Card.Body>

                                    <div className="image-id">
                                        {item.id}
                                    </div>
                                </Card>
                                {/* <td className='image'><img className='d-block w-100' src={item.url} alt="" /></td>
                                <td>#{item.id}</td>
                                <td>{item.nome}</td>
                                <td className='updatedAt'>{updatedAt}</td>
                                <td className='actions'>
                                    <div>

                                    </div>
                                </td> */}
                            </Col>
                        )
                    })}
                </Row>
                : 'Nenhuma imagem foi encontrada.'}
        </Container>
    )
}

export default Images

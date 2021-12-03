import React, { useState } from 'react'
import { Container, Form, Col, Row, Button, FloatingLabel } from 'react-bootstrap'
import { useParams, Link } from 'react-router-dom'
import moment from 'moment'

import useGet from '../hooks/useGet'
import ImageControl from '../components/ImageControl'
import { handleFormChange, apiCreate, apiUpdate, apiDelete } from '../helpers'

import '../scss/View.scss'

const API_URL = process.env.REACT_APP_API_URL

async function deleteEmpre(id) {

    if (window.confirm('ATENÇÃO!\nDeseja realmente excluir este registro?')) {
        apiDelete(endpoint, id).then(res => {
            alert(res.message);
            window.location.href = '/empreendimentos'
        })

    }
}

const initialFields = {
    nome: '',
    endereco: '',
    area_cabana: '',
    logo: {
        id: 0
    },
    cover: {
        id: 0
    },
};

const errors = {
    requiredText: 'Campo obrigatório'
}

const archiveLink = '/empreendimentos';
const imagesLink = '/images';
const endpoint = 'empreendimentos';

function Empreendimento() {

    const { id } = useParams()


    let editMode = (typeof id !== 'undefined');

    const [fields, setFields] = useState(initialFields)
    const [validated, setValidated] = useState(false);

    const { loading, error, data } = useGet(API_URL + endpoint + '/read_single.php?id=' + id);

    if (editMode && loading) return (
        <Container className='Empreendimento ViewSingle my-5'>
            <p>Carregando...</p>
        </Container>
    );
    if (editMode && error) return (
        <Container className='Empreendimento ViewSingle my-5'>
            <p>Erro ao carregar.</p>
        </Container>
    );

    if (editMode && data && fields === initialFields) {
        setFields(data)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true)
        }
        else {

            if (!editMode) {
                // submit form data
                apiCreate(endpoint, fields).then(response => {
                    if (response) {

                        alert(response.message);
                        if (response.success !== false)
                            window.location.href = '/empreendimento/' + response.data.id
                    }
                })
            }
            else {
                apiUpdate(endpoint, fields, data).then(response => {
                    if (response) {

                        alert(response.message);
                        if (response.success !== false)
                            window.location.href = '/empreendimento/' + data.id
                    }
                })
            }
        }
    }

    const handleChange = (e) => {
        handleFormChange(e, fields, setFields)
    }

    return (
        <Container className='Empreendimento View Single my-5'>

            <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <div className="d-flex flex-column flex-md-row heading">
                    <div className="d-flex m-auto ms-md-0">
                        <h1 className='title'>{(editMode) ? 'Alterar' : 'Novo'} Empreendimento</h1>
                        <span className='m-auto ms-3'>
                            <Link className='icon' title='Voltar' to={archiveLink}>
                                <span className='bi-arrow-left'></span> Voltar
                            </Link>
                        </span>
                    </div>

                    <span className='m-auto mt-2 mt-sm-auto me-md-0'>
                        <Button variant='primary' type="submit">
                            {(editMode) ? 'Atualizar' : 'Salvar'}
                        </Button>
                        <Button
                            variant='outline-danger'
                            className='ms-2'
                            type="button"
                            disabled={(!editMode)}
                            onClick={() => { if (editMode) deleteEmpre(data.id) }}>
                            Excluir
                        </Button>
                    </span>
                </div>

                <Row className='single-inner'>
                    <Col className='edit'>

                        <Form.Group className='form-row' controlId="nome">
                            <Form.Label>Nome:</Form.Label>
                            <Form.Control onChange={handleChange}
                                value={fields.nome}
                                type="text"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.requiredText}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='form-row' controlId="endereco">
                            <Form.Label>Endereço:</Form.Label>
                            <Form.Control onChange={handleChange}
                                value={fields.endereco}
                                type="text"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.requiredText}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='form-row' controlId="area_cabana">
                            <Form.Label>Área da Cabana:</Form.Label>
                            <Form.Control onChange={handleChange}
                                value={fields.area_cabana}
                                as="textarea"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.requiredText}
                            </Form.Control.Feedback>
                            <Form.Text muted>
                                Texto que deverá ser exibido na seção "Área da Cabana" do contrato.
                            </Form.Text>
                        </Form.Group>

                        <div className="d-flex mt-4 m-auto ms-md-0">
                            <h3 className='mb-0'>Imagens</h3>
                            <span className='m-auto ms-2'>
                                <Link 
                                    className='icon text-decoration-none' 
                                    title='Consultar imagens' 
                                    to={imagesLink}
                                    target="_blank" rel="noopener noreferrer" 
                                >
                                    <span className='bi-arrow-up-right'></span>
                                </Link>
                            </span>
                        </div>
                        <hr className='mt-2' />

                        <ImageControl
                            controlId='logo'
                            label='Logo do Empreendimento'
                            value={fields.logo}
                            fields={fields}
                            setFields={setFields}>
                        </ImageControl>
                        <ImageControl
                            controlId='cover'
                            label='Imagem do Empreendimento'
                            value={fields.cover}
                            fields={fields}
                            setFields={setFields}>
                        </ImageControl>



                        <div className="d-flex mt-4 m-auto ms-md-0">
                            <h3 className='mb-0'>Cabanas</h3>
                        </div>
                        <hr className='mt-2' />

                        <div className="CabanaControl ms-2">
                            <h5>Cabana 1</h5>

                            <div className="d-flex mt-4 m-auto ms-md-0">
                                <h6 className='mb-0'>Cotas</h6>
                            </div>
                            <hr className='mt-2' />
                        </div>

                    </Col>
                    <Col className='options'>

                        <div className="d-flex flex-column">
                            <div className="ms-auto">
                                {(editMode && data) ? (
                                    <div className='mt-2 text-end'>
                                        <small className='text-muted'>Última atualização:</small>
                                        <div>{moment(data.updated_at).format('DD/MM/YYYY HH:mm')}</div>
                                    </div>
                                ) : ''}
                            </div>
                        </div>

                    </Col>
                </Row>
            </Form>
        </Container>
    )
}

export default Empreendimento

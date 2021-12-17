import React, { useState } from 'react'
import { Container, Form, Col, Row, Button, FloatingLabel } from 'react-bootstrap'
import { useParams, Link, useNavigate } from 'react-router-dom'
import InputMask from 'react-input-mask';
import moment from 'moment'

import useGet from '../hooks/useGet'
import ImageControl from '../components/ImageControl'
import PasswordControl from '../components/PasswordControl'
import EditHeading from '../components/EditHeading'
import { errors, handleFormChange, apiCreate, apiUpdate, apiDelete, roles } from '../helpers'

import '../scss/View.scss'

const API_URL = process.env.REACT_APP_API_URL

const initialFields = {
    desconto_max: {
        value: '',
        updated_at: ''
    },
    entrada_min: {
        value: '',
        updated_at: ''
    }
};

const singleLink = '/imobiliaria/';
const archiveLink = '/imobiliarias';
const imagesLink = '/images';
const endpoint = 'configs';

async function resetAllConfig() {

    if (window.confirm('ATENÇÃO!\nDeseja realmente restaurar para configurações iniciais?')) {
        let request = {
            resetAll: true
        }
        apiUpdate(endpoint, request).then(res => {
            alert(res.message);
            window.location.reload();
        })

    }
}

function Config() {

    const { id } = useParams()

    const navigate = useNavigate();

    const [fields, setFields] = useState(initialFields)
    const [validated, setValidated] = useState(false);

    const { loading, error, data } = useGet(API_URL + endpoint + '/read.php');

    if (loading) return (
        <Container className='Config ViewSingle my-5'>
            <p>Carregando...</p>
        </Container>
    );
    if (error) return (
        <Container className='Config ViewSingle my-5'>
            <p>Erro ao carregar.</p>
        </Container>
    );

    if (data.success !== false && fields === initialFields) {
        setFields(data.data)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true)
        }
        else {
            apiUpdate(endpoint, fields).then(response => {
                if (response) {

                    alert(response.message);
                    if (response.success !== false)
                        window.location.reload()
                }
            })
        }
    }

    const handleChange = (e) => {
        handleFormChange(e, fields, setFields)
    }

    return (
        <Container className='Config View Single my-5'>

            <Form onSubmit={handleSubmit} noValidate validated={validated}>

                <EditHeading
                    title={'Configurações'}
                >
                    <Button variant='primary' type="submit">
                        Salvar
                    </Button>
                    <Button
                        variant='outline-danger'
                        className='ms-2'
                        type="reset"
                        onClick={() => { resetAllConfig() }}>
                        Restaurar
                    </Button>
                </EditHeading>

                <Row className='single-inner'>
                    <Col className='edit'>

                        <Form.Group className='form-row' controlId="desconto_max.value">
                            <Form.Label>Desconto máximo (%):</Form.Label>
                            <Form.Control onChange={handleChange}
                                value={fields.desconto_max.value}
                                type="number"
                                required
                            />
                            <Form.Text text-muted>
                                <small className='fw-normal text-muteder d-block'>
                                    Atualizado em: {moment(fields.desconto_max.updated_at).format('DD/MM/YYYY HH:mm')}
                                </small>
                            </Form.Text>
                            <Form.Control.Feedback type="invalid">
                                {errors.requiredText}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='form-row' controlId="entrada_min.value">
                            <Form.Label>Entrada mínima (R$):</Form.Label>
                            <Form.Control onChange={handleChange}
                                value={fields.entrada_min.value}
                                type="number"
                                required
                            />
                            <Form.Text text-muted>
                                <small className='fw-normal text-muteder d-block'>
                                    Atualizado em: {moment(fields.entrada_min.updated_at).format('DD/MM/YYYY HH:mm')}
                                </small>
                            </Form.Text>
                            <Form.Control.Feedback type="invalid">
                                {errors.requiredText}
                            </Form.Control.Feedback>
                        </Form.Group>

                    </Col>
                </Row>
            </Form>
        </Container>
    )
}

export default Config

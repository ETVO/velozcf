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

const estado_civil_options = ['Solteiro', 'Casado', 'Separado', 'Divorciado', 'Viúvo'];

const initialFields = {
    nome: '',
    cnpj: '',
    endereco: '',
    bairro: '',
    cep: '',
    cidade: '',
};

const singleLink = '/imobiliaria/';
const archiveLink = '/imobiliarias';
const imagesLink = '/images';
const endpoint = 'imobiliarias';

function Imobiliaria() {

    let minDataNasc = moment().subtract(105, 'years')
    let maxDataNasc = moment().subtract(18, 'years')

    const { id } = useParams()

    const navigate = useNavigate();

    let editMode = (typeof id !== 'undefined');

    const [fields, setFields] = useState(initialFields)
    const [validated, setValidated] = useState(false);

    const { loading, error, data } = useGet(API_URL + endpoint + '/read_single.php?id=' + id);

    if (editMode && loading) return (
        <Container className='Imobiliaria ViewSingle my-5'>
            <p>Carregando...</p>
        </Container>
    );
    if (editMode && error) return (
        <Container className='Imobiliaria ViewSingle my-5'>
            <p>Erro ao carregar.</p>
        </Container>
    );

    async function deleteImob(id) {

        if (window.confirm('ATENÇÃO!\nDeseja realmente excluir este registro?')) {
            apiDelete(endpoint, id).then(res => {
                alert(res.message);
                navigate(archiveLink);
            })

        }
    }

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
                            navigate(singleLink + response.data.id)
                    }
                })
            }
            else {
                apiUpdate(endpoint, fields, data).then(response => {
                    if (response) {

                        alert(response.message);
                        if (response.success !== false)
                            window.location.reload()
                    }
                })
            }
        }
    }

    const handleChange = (e) => {
        handleFormChange(e, fields, setFields)
    }

    return (
        <Container className='Imobiliaria View Single my-5'>

            <Form onSubmit={handleSubmit} noValidate validated={validated}>

                <EditHeading
                    title={((editMode) ? 'Alterar' : 'Nova') + ' Imobiliária'}
                    iconLink={archiveLink}
                >
                    <Button variant='primary' type="submit">
                        {(editMode) ? 'Atualizar' : 'Salvar'}
                    </Button>
                    <Button
                        variant='outline-danger'
                        className='ms-2'
                        type="button"
                        disabled={(!editMode)}
                        onClick={() => { if (editMode) deleteImob(data.id) }}>
                        Excluir
                    </Button>
                </EditHeading>

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

                        <Form.Group className='form-row' controlId="cnpj">
                            <Form.Label>CNPJ:</Form.Label>
                            <Form.Control onChange={handleChange}
                                as={InputMask}
                                defaultValue={fields.cnpj}
                                mask="99.999.999/9999-99"
                                maskChar="_"
                                placeholder='00.000.000/0000-00'
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

                        <Row className='form-row'>
                            <Form.Group as={Col} lg={7} controlId="bairro">
                                <Form.Label>Bairro:</Form.Label>
                                <Form.Control onChange={handleChange}
                                    value={fields.bairro}
                                    type="text"
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.requiredText}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} lg={5} controlId="cep">
                                <Form.Label>CEP:</Form.Label>
                                <Form.Control onChange={handleChange}
                                    value={fields.cep}
                                    type="text"
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.requiredText}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        

                        <Form.Group className='form-row' controlId="cidade">
                            <Form.Label>Cidade/UF:</Form.Label>
                            <Form.Control onChange={handleChange}
                                value={fields.cidade}
                                type="text"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.requiredText}
                            </Form.Control.Feedback>
                        </Form.Group>

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

export default Imobiliaria

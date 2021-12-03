import React, { useState } from 'react'
import { Container, Form, Col, Row, Button, FloatingLabel } from 'react-bootstrap'
import { useParams, Link } from 'react-router-dom'
import moment from 'moment'

import useGet from '../hooks/useGet'
import GalleryControl from '../components/GalleryControl'
import EditHeading from '../components/EditHeading'
import { errors, handleFormChange, apiCreate, apiUpdate, apiDelete, fieldsChangeArray } from '../helpers'

import '../scss/View.scss'

const { forwardRef, useRef, useImperativeHandle } = React;

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
    tamanho: '',
    quartos: '',
    valor_base: '',
    id_mapa: '',
    galeria: [],
    empreendimento: 0
};

const archiveLink = '/empreendimentos';
const imagesLink = '/images';
const endpoint = 'empreendimentos';

function Cabana() {

    const { id } = useParams()

    let editMode = (typeof id !== 'undefined');

    const [fields, setFields] = useState(initialFields)
    const [validated, setValidated] = useState(false);

    const changeNome = (e) => {
        let { value: nome } = e.target;
        let id_mapa = nome.replace(/\s/g, "").toLowerCase();
        
        fieldsChangeArray({
            id_mapa: id_mapa,
            nome: nome
        }, ['id_mapa', 'nome'], fields, setFields);
    }

    const { loading, error, data } = useGet(API_URL + endpoint + '/read_single.php?id=' + id);

    const cabanasRef = useRef();

    if (editMode && loading) return (
        <Container className='Cabana ViewSingle my-5'>
            <p>Carregando...</p>
        </Container>
    );
    if (editMode && error) return (
        <Container className='Cabana ViewSingle my-5'>
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

            cabanasRef.current.saveChanges();

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
        <Container className='Cabana View Single my-5'>

            <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <EditHeading
                    title={((editMode) ? 'Alterar' : 'Nova') + ' Cabana'}
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
                        onClick={() => { if (editMode) deleteEmpre(data.id) }}>
                        Excluir
                    </Button>
                </EditHeading>



                <Row className='single-inner'>
                    <Col className='edit'>

                        <div className="static-fields">
                            <Form.Group className='form-row' controlId="nome">
                                <Form.Label>Nome:</Form.Label>
                                <Form.Control onChange={changeNome}
                                    value={fields.nome}
                                    type="text"
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.requiredText}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Row>
                                <Form.Group as={Col} className='form-row' controlId="tamanho">
                                    <Form.Label>Tamanho:</Form.Label>
                                    <Form.Control onChange={handleChange}
                                        value={fields.tamanho}
                                        type="text"
                                        placeholder='75m2'
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.requiredText}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                
                                <Form.Group as={Col} className='form-row' controlId="quartos">
                                    <Form.Label>Quartos:</Form.Label>
                                    <Form.Control onChange={handleChange}
                                        value={fields.quartos}
                                        type="text"
                                        placeholder='2 quartos'
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.requiredText}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Form.Group className='form-row' controlId="valor_base">
                                <Form.Label>Valor base:</Form.Label>
                                <Form.Control onChange={handleChange}
                                    value={fields.valor_base}
                                    type="number"
                                    min={0}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.requiredText}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className='form-row' controlId="id_mapa">
                                <Form.Label>ID Mapa:</Form.Label>
                                <Form.Control 
                                    readOnly
                                    value={fields.id_mapa}
                                    type="text"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.requiredText}
                                </Form.Control.Feedback>
                                <Form.Text muted>
                                    ID do elemento na ilustração SVG.
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

                            <GalleryControl 
                                controlId='galeria'
                                label='Galeria de Fotos'
                                value={fields.galeria}
                                fields={fields}
                                setFields={setFields}/>

                            
                        </div>

                        {/* 
                        <div className="dynamic-fields">
                            <div className="d-flex mt-4 m-auto ms-md-0">
                                <h3 className='mb-0'>Cabanas</h3>
                            </div>
                            <hr className='mt-2' />

                            {(editMode && data) ? (
                                <Cabanas empId={data.id} ref={cabanasRef} />
                            ) : 'Salve as alterações para inserir cabanas.'}

                        </div> */}

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

export default Cabana

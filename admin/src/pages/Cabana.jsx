import React, { useState } from 'react'
import { Container, Form, Col, Row, Button, FloatingLabel } from 'react-bootstrap'
import { useParams, Link, useNavigate } from 'react-router-dom'
import moment from 'moment'

import useGet from '../hooks/useGet'
import ImageControl from '../components/ImageControl'
import GalleryControl from '../components/GalleryControl'
import EditHeading from '../components/EditHeading'
import Cotas from '../components/Cotas'
import { errors, handleFormChange, apiCreate, apiUpdate, apiDelete, fieldsChangeArray } from '../helpers/helpers'

import '../scss/View.scss'

const { forwardRef, useRef, useImperativeHandle } = React;

const DEFAULT_EMPRE_ID = process.env.REACT_APP_DEFAULT_EMPRE_ID ?? 1

const initialFields = {
    numero: '',
    id_mapa: '',
    imagem: {
        id: 0
    },
    galeria: '',
    disponivel: 1,
    empreendimento_id: DEFAULT_EMPRE_ID,
};

const API_URL = process.env.REACT_APP_API_URL

const archiveLink = '/cabanas';
const singleLink = '/cabana';
const imagesLink = '/images';
const endpoint = 'cabanas';
const empresLink = '/empreendimentos';

function Cabana() {

    const { id } = useParams()

    const navigate = useNavigate();

    let editMode = (typeof id !== 'undefined');

    const [fields, setFields] = useState(initialFields)
    const [validated, setValidated] = useState(false);

    const changeNumero = (e) => {
        let { value: numero } = e.target;
        let id_mapa = 'cabana' + numero;

        fieldsChangeArray({
            id_mapa: id_mapa,
            numero: numero
        }, ['id_mapa', 'numero'], fields, setFields);
    }

    async function deleteCabana(id) {

        if (window.confirm('ATENÇÃO!\nDeseja realmente excluir este registro?')) {
            apiDelete(endpoint, id).then(res => {
                alert(res.message);
                window.location.reload();
                // navigate(archiveLink);
            })

        }
    }

    const { loading, error, data } = useGet(API_URL + endpoint + '/read_single.php?id=' + id);

    const cotasRef = useRef();

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


            if (!editMode) {
                // submit form data
                apiCreate(endpoint, fields).then(response => {
                    if (response) {

                        alert(response.message);
                        if (response.success !== false)
                            navigate(singleLink + '/' + response.data.id);
                    }
                })
            }
            else {
                cotasRef.current.saveChanges();
                apiUpdate(endpoint, fields).then(response => {
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
                        onClick={() => { if (editMode) deleteCabana(data.id) }}>
                        Excluir
                    </Button>
                </EditHeading>

                <Row className='single-inner'>
                    <Col className='edit'>

                        <div className="static-fields">
                            {/* <Form.Group className='form-row' controlId="empreendimento_id">
                                <Form.Label>Empreendimento:
                                </Form.Label>
                                <Form.Control onChange={handleChange}
                                    value={fields.empreendimento_id}
                                    type="number"
                                    min={0}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.requiredText}
                                </Form.Control.Feedback>
                                <Form.Text muted>
                                    Insira o ID do Empreendimento ao qual esta cabana pertence.
                                </Form.Text>
                            </Form.Group> */}

                            <Form.Group className='form-row' controlId="numero">
                                <Form.Label>Número:</Form.Label>
                                <Form.Control onChange={changeNumero}
                                    value={fields.numero}
                                    type="number"
                                    min={0}
                                    step={1}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.requiredText}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className='form-row' controlId="disponivel">
                                <Form.Label>Disponível:</Form.Label>
                                <div>
                                    <Form.Check
                                        onChange={handleChange}
                                        inline
                                        type='radio'
                                        name='disponivel'
                                        value={1}
                                        label='Sim'
                                        defaultChecked={(fields.disponivel == true)}
                                    />
                                    <Form.Check
                                        onChange={handleChange}
                                        inline
                                        type='radio'
                                        name='disponivel'
                                        value={0}
                                        label='Não'
                                        defaultChecked={(fields.disponivel == false)}
                                    />
                                </div>
                                <Form.Control.Feedback type="invalid">
                                    {errors.requiredText}
                                </Form.Control.Feedback>
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
                                        <span className='bi-arrow-up-right'></span> Consultar
                                    </Link>
                                </span>
                            </div>
                            <hr className='mt-2' />

                            <GalleryControl
                                controlId='galeria'
                                label='Galeria de Fotos'
                                value={fields.galeria}
                                fields={fields}
                                setFields={setFields} />

                            <ImageControl
                                controlId='imagem'
                                label='Imagem da Cabana'
                                value={fields.imagem}
                                fields={fields}
                                setFields={setFields}>
                            </ImageControl>


                        </div>


                        <div className="dynamic-fields">
                            <div className="d-flex mt-4 m-auto ms-md-0">
                                <h3 className='mb-0'>Cotas</h3>
                            </div>
                            <hr className='mt-2 mb-2' />

                            {(editMode && data) ? (
                                <Cotas cabanaId={data.id} ref={cotasRef} />
                            ) : 'Salve as alterações para inserir cotas.'}

                        </div>

                    </Col>
                    <Col className='options'>

                        {/* <div className="d-flex flex-column">
                            <div className="ms-auto">
                                {(editMode && data) ? (
                                    <div className='mt-2 text-end'>
                                        <small className='text-muted'>Última atualização:</small>
                                        <div>{moment(data.updated_at).format('DD/MM/YYYY HH:mm')}</div>
                                    </div>
                                ) : ''}
                            </div>
                        </div> */}

                    </Col>
                </Row>
            </Form>
        </Container>
    )
}

export default Cabana

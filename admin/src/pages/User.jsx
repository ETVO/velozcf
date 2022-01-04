import React, { useState, Fragment } from 'react'
import { Container, Form, Col, Row, Button, FloatingLabel } from 'react-bootstrap'
import { useParams, Link, useNavigate } from 'react-router-dom'
import InputMask from 'react-input-mask';
import md5 from 'md5'
import moment from 'moment'

import useGet from '../hooks/useGet'
import ImageControl from '../components/ImageControl'
import PasswordControl from '../components/PasswordControl'
import EditHeading from '../components/EditHeading'
import { errors, initialInfo, handleFormChange, apiCreate, apiUpdate, apiDelete, roles, fieldsChange } from '../helpers/helpers'

import '../scss/View.scss'

const API_URL = process.env.REACT_APP_API_URL

const estado_civil_options = ['Solteiro', 'Casado', 'Separado', 'Divorciado', 'Viúvo'];

const initialFields = {
    username: '',
    email: '',
    password: '',
    role: '',
    estado_civil: estado_civil_options[0],
    creci: '',
    blocked: 0,
    info: initialInfo,
    photo: {
        id: 0,
    },
    imobiliaria: {
        id: 0,
    }
};

const singleLink = '/user/';
const archiveLink = '/users';
const imagesLink = '/images';
const imobsLink = '/imobiliarias';
const endpoint = 'users';

function User({ token }) {

    let minDataNasc = moment().subtract(105, 'years')
    let maxDataNasc = moment().subtract(18, 'years')

    const { id: param_id } = useParams()

    const navigate = useNavigate();

    let id = param_id;

    if(!param_id && !token) navigate('/');
    if(token.role === 'venda') id = token.id;

    let editMode = (typeof id !== 'undefined');

    const [fields, setFields] = useState(initialFields)
    const [validated, setValidated] = useState(false);

    const { loading, error, data } = useGet(API_URL + endpoint + '/read_single.php?id=' + id);

    if (editMode && loading) return (
        <Container className='User ViewSingle my-5'>
            <p>Carregando...</p>
        </Container>
    );
    if (editMode && error) return (
        <Container className='User ViewSingle my-5'>
            <p>Erro ao carregar.</p>
        </Container>
    );

    async function deleteUser(id) {

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
                        if (response.username_taken === true) {
                            document.getElementById('username').value = '';
                            document.getElementById('username').focus();
                            // fieldsChange('', 'username', fields, setFields);
                        }
                        else if (response.success !== false)
                            navigate(singleLink + response.data.id)
                    }
                })
            }
            else {
                apiUpdate(endpoint, fields, data).then(response => {
                    if (response) {

                        alert(response.message);
                        if (response.username_taken === true) {
                            document.getElementById('username').value = '';
                            document.getElementById('username').focus();
                            // fieldsChange('', 'username', fields, setFields);
                        }
                        else if (response.success !== false)
                            window.location.reload()
                    }
                })
            }
        }
    }

    const handleChange = (e) => {
        let { value, id } = e.target;
        if (id === 'password') {
            value = md5(value);
        }
        fieldsChange(value, id, fields, setFields);
    }

    return (
        <Container className='User View Single my-5'>

            <Form onSubmit={handleSubmit} onKeyDown={(e) => e.key !== 'Enter'} noValidate validated={validated}>

                <EditHeading
                    title={((token.role === 'venda') ? 'Meu' : (editMode) ? 'Alterar' : 'Novo') + ' Usuário'}
                    iconLink={(token.role === 'admin') ? archiveLink : ''}
                >
                    <Button variant='primary' type="submit">
                        {(editMode) ? 'Atualizar' : 'Salvar'}
                    </Button>
                    {(token.role === 'admin' && token.id !== id) ?
                    <Button
                        variant='outline-danger'
                        className='ms-2'
                        type="button"
                        disabled={(!editMode)}
                        onClick={() => { if (editMode) deleteUser(data.id) }}>
                        Excluir
                    </Button>
                    : '' }
                </EditHeading>

                <Row className='single-inner'>
                    <Col className='edit'>

                        <Row className='form-row'>
                            <Form.Group as={Col} controlId="username">
                                <Form.Label>Nome de Usuário:</Form.Label>
                                <Form.Control onChange={handleChange}
                                    value={fields.username}
                                    type="text"
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.requiredText}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} controlId="email">
                                <Form.Label>Email:</Form.Label>
                                <Form.Control onChange={handleChange}
                                    value={fields.email}
                                    type="text"
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.requiredText}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <PasswordControl
                            label='Senha:'
                            controlId='password'
                            handleChange={handleChange}
                            editMode={(editMode)}
                        />

                        {(token.role === 'admin') ?

                            <Fragment>
                                <Form.Group className='form-row' controlId="role">
                                    <Form.Label>Função:</Form.Label>
                                    <Form.Select onChange={handleChange} value={fields.role}>
                                        {Object.keys(roles).map(key => {
                                            return (
                                                <option key={key} value={key}>{roles[key]}</option>
                                            );
                                        })}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.requiredText}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className='form-row' controlId="imobiliaria.id">
                                    <Form.Label>Imobiliária
                                        (<Link
                                            title='Consultar empreendimentos'
                                            to={imobsLink}
                                            target="_blank" rel="noopener noreferrer"
                                        >
                                            <small>Consultar imobiliárias</small>
                                        </Link>):
                                    </Form.Label>
                                    <Form.Control onChange={handleChange}
                                        value={(fields.imobiliaria.id === null) ? 0 : fields.imobiliaria.id}
                                        type="number"
                                        min={0}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.requiredText}
                                    </Form.Control.Feedback>
                                    <Form.Text muted>
                                        Insira o ID da Imobiliária à qual este usuário está associado.
                                    </Form.Text>
                                </Form.Group>
                            </Fragment>

                            : ''}

                        <h3 className='mt-4 mb-0'>Informações</h3>
                        <hr className='mt-2' />

                        <Form.Group className='form-row' controlId="info.nome_completo">
                            <Form.Label>Nome Completo:</Form.Label>
                            <Form.Control onChange={handleChange}
                                value={fields.info.nome_completo}
                                type="text"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.requiredText}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='form-row' controlId="estado_civil">
                            <Form.Label>Estado civil:</Form.Label>
                            <Form.Select onChange={handleChange} value={fields.estado_civil}>
                                {estado_civil_options.map(option => {
                                    return (
                                        <option key={option} value={option}>{option}</option>
                                    );
                                })}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.requiredText}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='form-row' controlId="creci">
                            <Form.Label>CRECI:</Form.Label>
                            <Form.Control onChange={handleChange}
                                value={fields.creci}
                                type="text"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.requiredText}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Row className='form-row'>
                            <Form.Group as={Col} controlId="info.nacionalidade">
                                <Form.Label>Nacionalidade:</Form.Label>
                                <Form.Control onChange={handleChange}
                                    value={fields.info.nacionalidade}
                                    type="text"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.requiredText}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} controlId="info.profissao">
                                <Form.Label>Profissão:</Form.Label>
                                <Form.Control onChange={handleChange}
                                    value={fields.info.profissao}
                                    type="text"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.requiredText}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Form.Group className='form-row' controlId="info.data_nasc">
                            <Form.Label>Data de nascimento:</Form.Label>
                            <Form.Control onChange={handleChange}
                                value={fields.info.data_nasc}
                                min={minDataNasc.format('YYYY-MM-DD')}
                                max={maxDataNasc.format('YYYY-MM-DD')}
                                type="date"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.invalidDate}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Row className="form-row">
                            <Form.Group as={Col} controlId="info.cpf">
                                <Form.Label>CPF:</Form.Label>
                                <Form.Control onChange={handleChange}
                                    as={InputMask}
                                    defaultValue={fields.info.cpf}
                                    mask="999.999.999-99"
                                    maskChar="_"
                                    placeholder='000.000.000-00'
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.requiredText}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} controlId="info.rg">
                                <Form.Label>RG:</Form.Label>
                                <Form.Control onChange={handleChange} type="text"
                                    defaultValue={fields.info.rg}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.requiredText}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} controlId="info.orgao_exp">
                                <Form.Label>Órgão Exp.:</Form.Label>
                                <Form.Control onChange={handleChange} type="text"
                                    defaultValue={fields.info.orgao_exp}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.requiredText}
                                </Form.Control.Feedback>
                            </Form.Group>

                        </Row>

                        {/* <div className="d-flex mt-4 m-auto ms-md-0">
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

                        <ImageControl
                            controlId='photo'
                            label='Foto do Usuário:'
                            value={fields.photo}
                            fields={fields}
                            setFields={setFields}>
                        </ImageControl> */}

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

export default User

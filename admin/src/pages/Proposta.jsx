import React, { useState } from 'react'
import { Container, Form, Col, Row, Button, FloatingLabel } from 'react-bootstrap'
import { useParams, Link, useNavigate } from 'react-router-dom'
import moment from 'moment'

import useGet from '../hooks/useGet'
import ImageControl from '../components/ImageControl'
import EditHeading from '../components/EditHeading'
import { formatNumber, approveProposta, apiUpdate, apiDelete, initialInfo, initialPagamento, fieldsChange } from '../helpers/helpers'

import '../scss/View.scss'

const API_URL = process.env.REACT_APP_API_URL

const initialFields = {
    endereco: '',
    bairro: '',
    cep: '',
    cidade: '',
    telefone: '',
    email: '',
    estado_civil: '',
    regime_casamento: '',
    document_key: '',
    comprador: initialInfo,
    conjuge: initialInfo,
    unidades: [],
    pagamento: initialPagamento,
    aprovada: 0,
    empreendimento: {
        nome: ''
    },
    vendedor: {
        nome_completo: '',
        info: initialInfo,
        imobiliaria: {
            nome: ''
        }
    }
};

const singleLink = '/proposta/';
const archiveLink = '/propostas';
const imagesLink = '/images';
const endpoint = 'propostas';

function Propostas() {

    const { id } = useParams();

    const navigate = useNavigate();

    let editMode = (typeof id !== 'undefined');
    
    const [fields, setFields] = useState(initialFields)
    const [validated, setValidated] = useState(false);
    
    let { loading, error, data } = useGet(API_URL + endpoint + '/read_single.php?id=' + id);

    if (editMode && loading) return (
        <Container className='Propostas ViewSingle my-5'>
            <p>Carregando...</p>
        </Container>
    );
    if (editMode && error) return (
        <Container className='Propostas ViewSingle my-5'>
            <p>Erro ao carregar.</p>
        </Container>
    );

    if(data.success === false || !editMode) {
        navigate(archiveLink);
    }

    async function deleteProp(id) {

        if (window.confirm('ATENÇÃO!\nDeseja realmente excluir este registro?')) {
            apiDelete(endpoint, id).then(res => {
                if(res) {
                    alert(res.message);
                    navigate(archiveLink);
                }
            })

        }
    }

    async function approveProp(id) {

        if (window.confirm('ATENÇÃO!\nDeseja realmente aprovar esta proposta?')) {
            
            approveProposta(fields.id).then(res => {
                if(res) {
                    alert(res.message);
                    if(res.success !== false) {
                        window.location.reload()
                    }
                }
            })
        }
    }

    if (editMode && data && fields === initialFields) {


        let unidades = data.unidades;
        try {
            unidades = JSON.parse(unidades);

            data.unidades = [];
    
            for (var i = 0; i < Object.keys(unidades).length; i++) {
                data.unidades.push(unidades[i]);
                let cotas = unidades[i].cotas;
    
                unidades[i].cotas = [];
    
                for (var j = 0; j < Object.keys(cotas).length; j++) {
                    unidades[i].cotas.push(cotas[i]);
                }
            }
        } catch (err) {
            console.error(err);
        }
        
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
            if (editMode) {

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

    return (
        <Container className='Propostas View Single my-5'>

            <Form onSubmit={handleSubmit} noValidate validated={validated}>

                <EditHeading
                    title={'Visualizar Proposta'}
                    iconLink={archiveLink}
                >
                    <Button variant={(fields.aprovada == 1) ? 'outline-primary' : 'primary'} 
                        onClick={() => { if (editMode) approveProp(data.id) }}
                        disabled={(fields.aprovada == 1)}
                        title={(fields.aprovada == 1) ? 'Esta proposta já foi aprovada' : ''}>
                        {(fields.aprovada == 1) ? 'Aprovada!' : 'Aprovar'}
                    </Button>
                    <Button
                        variant='outline-danger'
                        className='ms-2'
                        type="button"
                        onClick={() => { if (editMode) deleteProp(data.id) }}>
                        Excluir
                    </Button>
                </EditHeading>

                <Row className='single-inner'>
                    <Col className='edit'>

                        <div className="mb-4">
                            <div className="review-section mt-2">
                                <h4>Comprador</h4>
                                <hr className='mt-2' />

                                <div className="field-view">
                                    <small>Nome completo:</small>
                                    <p>{fields.comprador.nome_completo}</p>
                                </div>

                                <div className='field-row'>
                                    <div className="field-view">
                                        <small>Data de nascimento:</small>
                                        <p>{moment(fields.comprador.data_nasc).format('DD/MM/yyyy')}</p>
                                    </div>
                                    <div className="field-view">
                                        <small>Nacionalidade:</small>
                                        <p>{fields.comprador.nacionalidade}</p>
                                    </div>
                                </div>

                                <div className="field-view">
                                    <small>Profissão:</small>
                                    <p>{fields.comprador.profissao}</p>
                                </div>

                                <div className="field-view">
                                    <small>Estado civil:</small>
                                    <p>{fields.estado_civil}</p>
                                </div>

                                <div className='field-row'>
                                    <div className="field-view">
                                        <small>CPF:</small>
                                        <p>{fields.comprador.cpf}</p>
                                    </div>
                                    <div className="field-view">
                                        <small>RG:</small>
                                        <p>{fields.comprador.rg}</p>
                                    </div>
                                    <div className="field-view">
                                        <small>Órgão exp.:</small>
                                        <p>{fields.comprador.orgao_exp}</p>
                                    </div>
                                </div>

                                <div className="field-view">
                                    <small>Endereço:</small>
                                    <p>{fields.endereco}</p>
                                </div>

                                <div className='field-row'>
                                    <div className="field-view">
                                        <small>Bairro:</small>
                                        <p>{fields.bairro}</p>
                                    </div>
                                    <div className="field-view">
                                        <small>CEP:</small>
                                        <p>{fields.cep}</p>
                                    </div>
                                </div>

                                <div className="field-view">
                                    <small>Cidade/UF:</small>
                                    <p>{fields.cidade}</p>
                                </div>

                                <div className='field-row'>
                                    <div className="field-view">
                                        <small>Telefone:</small>
                                        <p>{fields.telefone}</p>
                                    </div>
                                    <div className="field-view">
                                        <small>Email:</small>
                                        <p>{fields.email}</p>
                                    </div>
                                </div>
                            </div>

                            {
                                (fields.estado_civil === 'Casado') ? (
                                    <div className="review-section mt-3">
                                        <h4>Cônjuge</h4>
                                        <hr className='mt-2' />

                                        <div className="field-view">
                                            <small>Nome completo:</small>
                                            <p>{fields.conjuge.nome_completo}</p>
                                        </div>

                                        <div className='field-row'>
                                            <div className="field-view">
                                                <small>Data de nascimento:</small>
                                                <p>{moment(fields.conjuge.data_nasc).format('DD/MM/yyyy')}</p>
                                            </div>
                                            <div className="field-view">
                                                <small>Nacionalidade:</small>
                                                <p>{fields.conjuge.nacionalidade}</p>
                                            </div>
                                        </div>

                                        <div className="field-view">
                                            <small>Profissão:</small>
                                            <p>{fields.conjuge.profissao}</p>
                                        </div>

                                        <div className='field-row'>
                                            <div className="field-view">
                                                <small>CPF:</small>
                                                <p>{fields.conjuge.cpf}</p>
                                            </div>
                                            <div className="field-view">
                                                <small>RG:</small>
                                                <p>{fields.conjuge.rg}</p>
                                            </div>
                                            <div className="field-view">
                                                <small>Órgão exp.:</small>
                                                <p>{fields.conjuge.orgao_exp}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : ''}


                            <div className="review-section mt-3">
                                <h4>Corretor</h4>
                                <hr className='mt-2' />

                                <div className="field-view">
                                    <small>Nome completo:</small>
                                    <p>{fields.vendedor.info.nome_completo}</p>
                                </div>

                                <div className='field-row'>
                                    <div className="field-view">
                                        <small>Data de nascimento:</small>
                                        <p>{moment(fields.vendedor.info.data_nasc).format('DD/MM/yyyy')}</p>
                                    </div>
                                    <div className="field-view">
                                        <small>Nacionalidade:</small>
                                        <p>{fields.vendedor.info.nacionalidade}</p>
                                    </div>
                                </div>

                                <div className="field-row">
                                    <div className="field-view">
                                        <small>Profissão:</small>
                                        <p>{fields.vendedor.info.profissao}</p>
                                    </div>
                                    <div className="field-view">
                                        <small>CRECI:</small>
                                        <p>{fields.vendedor.creci}</p>
                                    </div>
                                </div>

                                <div className="field-view">
                                    <small>Estado civil:</small>
                                    <p>{fields.estado_civil}</p>
                                </div>

                                <div className='field-row'>
                                    <div className="field-view">
                                        <small>CPF:</small>
                                        <p>{fields.vendedor.info.cpf}</p>
                                    </div>
                                    <div className="field-view">
                                        <small>RG:</small>
                                        <p>{fields.vendedor.info.rg}</p>
                                    </div>
                                    <div className="field-view">
                                        <small>Órgão exp.:</small>
                                        <p>{fields.vendedor.info.orgao_exp}</p>
                                    </div>
                                </div>

                                <div className="field-view">
                                    <small>Email:</small>
                                    <p>{fields.vendedor.email}</p>
                                </div>

                                <div className="field-view">
                                    <small>Imobiliária:</small>
                                    <p>{fields.vendedor.imobiliaria.nome}</p>
                                </div>
                            </div>
                        </div>

                    </Col>
                    <Col className='cotas'>
                        {(fields.unidades) ? (
                            <div className="brief review-section mt-2">
                                <h4>Cotas</h4>
                                <hr className='mt-2' />

                                <div className="field-view">
                                    <small>Empreendimento:</small>
                                    <p>{fields.empreendimento.nome}</p>
                                </div>
                                {fields.unidades.map(cabana => {

                                    return (cabana) ? (
                                        <div key={cabana.id} className="brief-section my-2">
                                            <h5 className='brief-title'>Cabana {cabana.numero}</h5>
                                            {(cabana.cotas !== null) ? (
                                                cabana.cotas.map(cota => {
                                                    return (
                                                        <div key={cota.id} className="brief-section">
                                                            <span className='nome-cota'>
                                                                {'Cota ' + cota.numero}
                                                            </span>
                                                            <span className='datas ms-2'>
                                                                {'R$ ' + formatNumber(cota.valor)}
                                                            </span>
                                                        </div>
                                                    )
                                                })
                                            ) : ''}
                                        </div>
                                    ) : ''
                                })}
                                <span className='total-price'>{'R$ ' + formatNumber(fields.pagamento.valor_proposta)}</span>
                            </div>
                        ) : (
                            <div className="brief">
                                <p>Nenhuma unidade foi selecionada...</p>
                            </div>
                        )}
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

export default Propostas

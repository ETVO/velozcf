import React, { useState } from 'react'
import { Row, Col, Container, Button } from 'react-bootstrap'
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom'
import { 
    estado_civil_options, 
    apiRead, 
    apiReadSingle, 
    fetchImage, 
    formatNumber, 
    initialInfo, 
    initialPagamento 
} from '../helpers/helpers'
    
import { enviarProposta } from '../helpers/enviarProposta'

import '../scss/Proposta.scss'

// helpers
import useGet from '../hooks/useGet'

// components
import DadosPagamento from '../components/DadosPagamento'
import DadosComprador from '../components/DadosComprador'
import RevisaoProposta from '../components/RevisaoProposta'

const initialSelected = {
    cabanas: []
}

const initialUnidades = {
    cabanas: []
}

const initialFields = {
    unidades: [],
    endereco: '',
    bairro: '',
    cep: '',
    cidade: '',
    telefone: '',
    email: '',
    estado_civil: estado_civil_options[0],
    regime_casamento: '',
    comprador: initialInfo,
    conjuge: initialInfo,
    pagamento: initialPagamento,
    aprovada: 1,
    empreendimento: 0,
    vendedor: 0,
}

const API_URL = process.env.REACT_APP_API_URL;

export default function Proposta({ user }) {
    const { id } = useParams()

    const navigate = useNavigate()

    const { loading, error, data } = useGet(API_URL + 'cabanas/read.php?empreendimento_id=' + id);

    const [selected, setSelected] = useState(initialSelected)
    const [activeStage, setStage] = useState(0)
    const [fields, setFields] = useState(initialFields);

    /** set states on initial load */
    (async () => {

        // selected cotas from previous page (empreendimento)
        let storedSelected = JSON.parse(sessionStorage.getItem('selectedUnidades'))
        if (selected === initialSelected && storedSelected && storedSelected.empreendimentoId === id) {
            setSelected(storedSelected.selected)
        }

        // stage of the form 
        let storedStage = JSON.parse(sessionStorage.getItem('formStage'))
        if (activeStage === 0 && storedStage && storedStage.empreendimentoId === id) {
            setStage(storedStage.activeStage)
        }

        // fields values of the form 
        let storedFields = JSON.parse(sessionStorage.getItem('formFields'))
        if (fields === initialFields && storedFields && storedFields.empreendimentoId === id) {
            if (storedFields.fields.vendedor === 0) {
                storedFields.fields.vendedor = user.id
            }
            if (storedFields.fields.empreendimento === 0) {
                storedFields.fields.empreendimento = id
            }
            setFields(storedFields.fields)
        }
        else {

            if (fields.vendedor === 0) {
                let newFields = JSON.parse(JSON.stringify(fields));
                newFields.vendedor = user.id

                setFields(newFields);
            }
            if (fields.empreendimento === 0) {
                let newFields = JSON.parse(JSON.stringify(fields));
                newFields.empreendimento = parseInt(id)

                setFields(newFields);
            }

        }

        // get cabanas from selected
        if (data && fields.unidades.length === 0 && selected !== initialSelected) {
            let valor_proposta = 0.00;
            let tmp = data.data;
            let unidades = [];

            if (false) {
                await tmp.filter(async cabana => {

                    // get current cabana index
                    let cabanaIndex = selected.cabanas.map(c => c.id).indexOf(cabana.id)

                    console.log(cabana.nome, '\n' + cabanaIndex);

                    // return false if current cabana is not selected
                    if (cabanaIndex === -1) return false;

                    // Get array of IDs of selected cotas
                    let cotasIDs = selected.cabanas[cabanaIndex].cotas.map(c => c.id);

                    let cotasValores = selected.cabanas[cabanaIndex].cotas.map(c => c.valor);
                    cotasValores.reduce((valor_proposta, v) => valor_proposta + v, valor_proposta);

                    cabana.cotas = []
                    // loop through all the fetched cotas
                    cotasIDs.forEach(cota => {

                        valor_proposta += parseFloat(cota.valor)

                        const cotaData = new Promise(resolve => {
                            apiReadSingle('cotas', cota)
                                .then(res => {
                                    resolve(res);
                                });
                        })
                        cabana.cotas.push(cotaData);
                    });

                    cabana.cotas = await Promise.all(cabana.cotas);
                    unidades.push(cabana);
                });
            }

            selected.cabanas.forEach(cabana => {
                cabana.cotas.forEach(cota => {
                    valor_proposta += parseFloat(cota.valor)
                })
            })

            let tmpFields = JSON.parse(JSON.stringify(fields));
            tmpFields.pagamento.valor_proposta = valor_proposta;
            tmpFields.unidades = selected.cabanas;

            setFields(tmpFields)
        }
    })()

    const setStageFilter = (newStage) => {
        if (newStage) {
            let stageJSON = JSON.stringify({
                empreendimentoId: id,
                activeStage: newStage
            })

            sessionStorage.setItem('formStage', stageJSON)
            setStage(newStage)
        }
        else {
            sessionStorage.removeItem('formStage')
            setStage(0)
        }
    }

    const setFieldsFilter = (newFields) => {
        if (newFields) {
            let fieldsJSON = JSON.stringify({
                empreendimentoId: id,
                fields: newFields
            })

            sessionStorage.setItem('formFields', fieldsJSON)
            setFields(newFields)
        }
        else {
            sessionStorage.removeItem('formFields')
            setFields(initialFields)
        }
    }

    const setPaymentFields = (paymentFields) => {
        if (paymentFields) {
            let newFields = JSON.parse(JSON.stringify(fields))
            newFields.pagamento = paymentFields;

            let fieldsJSON = JSON.stringify({
                empreendimentoId: id,
                fields: newFields
            })

            sessionStorage.setItem('formFields', fieldsJSON)
            setFields(newFields)
        }
        else {
            let newFields = JSON.parse(JSON.stringify(fields))
            newFields.pagamento = initialPagamento

            let fieldsJSON = JSON.stringify({
                empreendimentoId: id,
                fields: newFields
            })

            sessionStorage.setItem('formFields', fieldsJSON)
            setFields(newFields)
        }
    }

    const submitNext = () => {
        if (activeStage === 2) {
            enviarProposta(fields)
        }
        else {
            setStageFilter(activeStage + 1)
        }
    }

    const stages = [
        <DadosComprador fields={fields} setFields={setFieldsFilter} submit={submitNext} />,
        <DadosPagamento paymentFields={fields.pagamento} setPaymentFields={setPaymentFields} submit={submitNext} />,
        <RevisaoProposta fields={fields} setFields={setFieldsFilter} submit={submitNext} />
    ]

    const prevText = [
        'Voltar para o mapa',
        'Voltar',
        'Voltar',
    ]

    const nextText = [
        'seguinte',
        'finalizar proposta',
        'finalizar e enviar proposta por email',
    ]

    const backClick = () => {
        if (activeStage === 0) {
            navigate('/empreendimento/' + id)
        }
        else {
            setStageFilter(activeStage - 1)
        }
    }

    if (loading) {
        return (
            <div className='Proposta d-flex h-100'>
                <p className='m-auto'>Carregando...</p>
            </div>
        )
    }
    if (error) {
        return (
            <div className='Proposta d-flex h-100'>
                <p className='m-auto'>Ocorreu um erro ao carregar a página de proposta.</p>
            </div>
        )
    }

    return (
        <div className='Proposta'>


            <Row className='w-100 m-0'>

                <Col lg={8} className='form-col'>

                    <div className="form-inner">
                        <div className="back-button" onClick={backClick}>
                            <span className='bi bi-chevron-left me-1'></span>
                            {prevText[activeStage]}
                        </div>

                        <div className="progress-bars my-3 d-flex justify-content-between">
                            {stages.map((stage, i) => {
                                let className = 'stage-bar'

                                if (activeStage === i)
                                    className += ' active'
                                else if (activeStage > i)
                                    className += ' previous'

                                return (
                                    <div key={'bar' + i} className={className}></div>
                                )
                            })}
                        </div>

                        <div className="stages mt-2 mb-4">
                            {stages.map((stage, i) => {
                                if (i === activeStage) {
                                    return (
                                        <div key={'stage' + i} className="stage-view">
                                            {stage}
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </div>

                </Col>

                <Col lg={4} className={'details-col' + ((activeStage === 2) ? ' d-none' : '')}>
                    <h4 className='title'>Detalhes da Proposta</h4>
                    {(selected !== initialSelected) ? (
                        <div className="brief">
                            <p className='title'>Unidade:</p>
                            {fields.unidades.map(cabana => {

                                return (cabana) ? (
                                    <div key={cabana.id} className="brief-section my-2">
                                        <h5 className='brief-title'>{cabana.nome}</h5>
                                        {(cabana.cotas) ? (
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
                            <Navigate to={'/empreendimento/' + id} />
                        </div>
                    )}
                    {(activeStage >= 1) ? (
                        <div className="brief mt-3">
                            <p className='title muted'>Comprador:</p>

                            <div className="brief-section mb-2">
                                <h5 className='brief-title'>{fields.comprador.nome_completo}</h5>
                                <span className=''>{fields.email}</span>
                            </div>
                        </div>
                    ) : (
                        <p onLoad={() => setStageFilter(1)}></p>
                    )}
                    {(activeStage >= 1 && fields.estado_civil === 'Casado') ? (
                        <div className="brief mt-3">
                            <p className='title muted'>Cônjuge:</p>

                            <div className="brief-section mb-2">
                                <h5 className='brief-title'>{fields.conjuge.nome_completo}</h5>
                            </div>
                        </div>
                    ) : ''}
                </Col>

            </Row>



        </div>
    )
}

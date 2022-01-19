import React, { useState } from 'react'
import { Form, Col, Row, Button } from 'react-bootstrap'
import { formatNumber, apiRead } from '../helpers/helpers';
import { calcParcela } from '../helpers/enviarProposta';

const API_URL = process.env.REACT_APP_API_URL

async function getConfigs() {
    const response = await fetch(API_URL + 'configs/read.php')

    const data = await response.json()

    return data;
}

export default function DadosPagamento({ paymentFields, setPaymentFields, submit }) {

    var [showEntradaError, setShowEntradaError] = useState(false);
    var [showDescontoError, setShowDescontoError] = useState(false);
    
    var [configs, setConfigs] = useState(null);
    
    (async () => {
        if (!configs) {
            apiRead('configs').then(res => {
                if(res) {
                    if(res.success !== false) {
                        setConfigs(res.data);
                    }
                }
            });
        }
    })()

    const [validated, setValidated] = useState(false);
    const [advanced, setAdvanced] = useState(false);

    const handleSubmit = e => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            setValidated(true)
        }
        else {
            submit()
        }
    }

    const handleChange = e => {
        e.preventDefault()
        let { value, id } = e.target

        changePaymentField(value, id)
    }

    const changePaymentField = (value, id) => {
        let formValues = JSON.parse(JSON.stringify(paymentFields))

        // If there are dots in the input id, use it to 
        // assign the value to a property one-level deeper
        if (id.indexOf('.') !== -1) {
            let ids = id.split('.')
            let id1 = ids[0]
            let id2 = ids[1]
            formValues[id1][id2] = value;
        }
        // Else, just assign it normally
        else {
            if (id === 'entrada') {
                if (value === '')
                    value = 0
                else
                    value = parseFloat(value)

                if (configs && value < configs.entrada_min.value) {
                    setShowEntradaError(true);
                }
                else {
                    setShowEntradaError(false);
                }
            }
            if (id === 'n_parcelas') {
                if (value === '')
                    value = 0
                else
                    value = parseInt(value)
            }
            if (id === 'desconto') {
                if (value === '')
                    value = 0
                else
                    value = parseFloat(value)

                if (configs && value > configs.desconto_max.value) {
                    setShowDescontoError(true);
                }
                else {
                    setShowDescontoError(false);
                }

            }

            formValues[id] = value;
        }

        setPaymentFields(formValues)
    }

    const getValorParcela = () => {

        let P = parseFloat(paymentFields.valor_proposta)
        const n = parseInt(paymentFields.n_parcelas)
        const e = parseFloat(paymentFields.entrada)

        return calcParcela(P, n, e)
    }

    const changeCode = (e) => {
        if (e.target.value === 'D6524CF') {
            setAdvanced(true);
        }
        else {
            setAdvanced(false);
        }
    }

    const requiredErrorText = 'Campo obrigatório.'

    return (
        <div className='DadosPagamento'>
            <h3>Informações</h3>

            <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <div className="form-section mb-4">
                    <div className="section-title">
                        <h5>Pagamento</h5>
                    </div>
                    <div className="section-content">
                        <Form.Group className="form-row" controlId="valor_proposta">
                            <Form.Label>Valor da proposta:</Form.Label>
                            <Form.Control
                                type="text"
                                value={'R$ ' + formatNumber(paymentFields.valor_proposta, true)}
                                disabled
                            />
                            <Form.Control.Feedback type="invalid">
                                {requiredErrorText}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="form-row" controlId="meioPagamento">
                            <Form.Label>Meio de pagamento:</Form.Label>
                            <Form.Control
                                type="text"
                                value={'Transferência / PIX'}
                                disabled
                            />
                            <Form.Control.Feedback type="invalid">
                                {requiredErrorText}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="form-row" controlId="entrada">
                            <Form.Label>Valor da entrada (R$):</Form.Label>
                            <Form.Control
                                onChange={handleChange}
                                type="number"
                                min={0}
                                defaultValue={paymentFields.entrada}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {requiredErrorText}
                            </Form.Control.Feedback>
                            {(showEntradaError) && (
                                <Form.Text className='text-danger'>
                                    A entrada mínima é de {'R$ ' + formatNumber(configs.entrada_min.value, true)}. A proposta terá de ser enviada para aprovação.
                                </Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group className="form-row" controlId="n_parcelas">
                            <Form.Label>Número de parcelas mensais:</Form.Label>
                            <Form.Control
                                onChange={handleChange}
                                type="number"
                                min={1}
                                defaultValue={paymentFields.n_parcelas}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {requiredErrorText}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="form-row" controlId="valor_parcela">
                            <Form.Label>Valor da parcela:</Form.Label>
                            <Form.Control
                                type="text"
                                value={'R$ ' + formatNumber(getValorParcela(), true)}
                                disabled
                            />
                            <Form.Control.Feedback type="invalid">
                                {requiredErrorText}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="form-row">
                            <Form.Label>Código:</Form.Label>
                            <Form.Control
                                onChange={changeCode}
                                type="password"
                            />
                        </Form.Group>

                        {(advanced) && (
                            <div className="form-section">
                                <div className="section-title">
                                    <h5>Avançado</h5>
                                </div>
                                <div className="section-content">
                                    <Form.Group className="form-row" controlId="desconto">
                                        <Form.Label>Desconto (%):</Form.Label>
                                        <Form.Control
                                            onChange={handleChange}
                                            type="number"
                                            min={0}
                                            defaultValue={paymentFields.desconto}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {requiredErrorText}
                                        </Form.Control.Feedback>
                                        {(showDescontoError) && (
                                            <Form.Text className='text-danger'>
                                                O desconto máximo é de {configs.desconto_max.value + '%'}. 
                                                A proposta terá de ser enviada para aprovação.
                                            </Form.Text>
                                        )}
                                    </Form.Group>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <Button className='ms-auto d-flex' type="submit">
                    <span className='my-auto'>finalizar proposta</span>
                    <span className='my-auto ms-1 bi bi-chevron-right'></span>
                </Button>
            </Form >
        </div >
    )
}

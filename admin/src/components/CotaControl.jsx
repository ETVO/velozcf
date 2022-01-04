import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Accordion, Form, Button, Row, Col } from 'react-bootstrap'

import { errors, fieldsChangeArray, fieldsChange, formatNumber } from '../helpers/helpers'

import '../scss/Components.scss'

const imagesLink = '/images';

const initialFields = {
    numero: '',
    valor: '',
    data_inicio: '',
    data_fim: '',
    disponivel: 1,
    reservada: 0,
    cabana_id: 0
}

function CotaControl ({ fields, cabanaId, parentChangeHandle, accordionChange, removeCota }) {

    // const [fields, setFields] = useState(initialFields);

    const index = fields.index;

    // if (fields === initialFields) {
    //     fieldsChange(cabanaId, 'cabana_id', fields, setFields);
    //     fieldsChange(index+1, 'numero', fields, setFields);
    // }

    const handleChange = (e) => {
        parentChangeHandle(e, index);
    }

    return (
        <Accordion.Item className='CotaControl' eventKey={fields.index}>
            <Accordion.Header onClick={() => accordionChange(index)}>
                    <div className="d-flex align-items-center">
                        <b>{fields.numero}</b>&nbsp;
                        {(fields.data_inicio && fields.data_fim) ? (
                            <small className='text-muted mx-2 d-flex flex-column'>
                                <span>
                                    {fields.data_inicio}
                                </span>
                                <span>
                                    {fields.data_fim}
                                </span>
                            </small>
                        ) : ''}
                        {(fields.valor) ? (
                            <div className='fw-bold text-primary d-flex flex-column'>
                                <span>
                                    {'R$ ' + formatNumber(fields.valor)}
                                </span>
                            </div>
                        ) : ''} 
                    </div>
                </Accordion.Header>
            <Accordion.Body>
                <Row className='form-row'>
                    <Form.Group as={Col} className='form-row' controlId={index + ".data_inicio"}>
                        <Form.Label>Data Início:</Form.Label>
                        <Form.Control onChange={handleChange}
                            value={fields.data_inicio}
                            type="text"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.requiredText}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} className='form-row' controlId={index + ".data_fim"}>
                        <Form.Label>Data Fim:</Form.Label>
                        <Form.Control onChange={handleChange}
                            value={fields.data_fim}
                            type="text"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.requiredText}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Form.Group className='form-row' controlId={index + ".valor"}>
                    <Form.Label>Valor (R$):</Form.Label>
                    <Form.Control onChange={handleChange}
                        value={fields.valor}
                        type="number"
                        min={0}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.requiredText}
                    </Form.Control.Feedback>
                </Form.Group>
                <Button variant='outline-danger' onClick={()=> removeCota(index)}>
                    <small>Excluir cota</small>
                </Button>
            </Accordion.Body>
        </Accordion.Item>
    )
};

export default CotaControl;
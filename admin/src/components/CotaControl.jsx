import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Accordion, Form, Button, Row, Col } from 'react-bootstrap'

import { errors, fieldsChangeArray, fieldsChange, formatNumber } from '../helpers/helpers'

import '../scss/Components.scss'

const imagesLink = '/images';

function CotaControl({ fields, parentChangeHandle, accordionChange, removeCota }) {

    const index = fields.index;

    const handleChange = (e) => {
        parentChangeHandle(e, index);
    }

    return (
        <Accordion.Item className='CotaControl' eventKey={fields.index}>
            <Accordion.Header onClick={() => accordionChange(index)}>
                <div className="d-flex align-items-center">
                    <b className='text-dark'>{fields.numero}</b>&nbsp;
                    {(fields.valor) ? (
                        <div className='ms-3 fw-bold text-primary d-flex flex-column'>
                            <span>
                                {'R$ ' + formatNumber(fields.valor)}
                            </span>
                        </div>
                    ) : ''}

                    <div className="ms-3 tag">
                        {
                            (fields.status === 'd') ? (
                                <span className='disponivel'>Disponível</span>
                            ) : (
                                (fields.status === 'r') ? (
                                    <span className='reservada'>Reservada</span>
                                ) : (
                                    <span className='vendida'>Vendida</span>   
                                )
                            )
                        }
                    </div>
                </div>
            </Accordion.Header>
            <Accordion.Body>

                <Form.Group className='form-row' controlId={index + ".status"}>
                    <Form.Label>Situação:</Form.Label>
                    <div>
                        <Form.Check
                            onChange={handleChange}
                            inline
                            type='radio'
                            name={index + ".status"}
                            value={'d'}
                            label='Disponível'
                            defaultChecked={(fields.status === 'd')}
                        />
                        <Form.Check
                            onChange={handleChange}
                            inline
                            type='radio'
                            name={index + ".status"}
                            value={'r'}
                            label='Reservada'
                            defaultChecked={(fields.status === 'r')}
                        />
                        <Form.Check
                            onChange={handleChange}
                            inline
                            type='radio'
                            name={index + ".status"}
                            value={'v'}
                            label='Vendida'
                            defaultChecked={(fields.status === 'v')}
                        />
                    </div>
                    <Form.Control.Feedback type="invalid">
                        {errors.requiredText}
                    </Form.Control.Feedback>
                </Form.Group>

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
                <Button variant='outline-danger' onClick={() => removeCota(index)}>
                    <small>Excluir cota</small>
                </Button>
            </Accordion.Body>
        </Accordion.Item>
    )
};

export default CotaControl;
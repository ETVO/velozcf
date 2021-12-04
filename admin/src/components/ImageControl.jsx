import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

import { fetchImage } from '../helpers'

import '../scss/Components.scss'

export default function ImageControl({ label, controlId, controlFeedback, required, fields, setFields }) {
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        e.preventDefault()
        let formValues = JSON.parse(JSON.stringify(fields))
        let { value, id, type } = e.target

        if (type !== 'number') window.location.reload();

        if (value === '') {
            e.target.setAttribute('value', 0)
            value = 0
        }

        if (value != 0) {
            fetchImage(value).then(data => {
                if (data.success === false) { // Image not found
                    formValues[id] = {
                        valid: false,
                        id: value
                    };
                }
                else { // Image found
                    formValues[id] = {
                        id: data.id,
                        url: data.url,
                        caption: data.caption
                    };
                }

                setFields(formValues)
            })
        }
        else { // Image not set

            formValues[id] = {
                id: 0
            };

            setFields(formValues)
        }
    }

    return (
        <Row className='ImageControl form-row'>
            <Form.Group as={Col} lg={8} controlId={controlId}>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                    onChange={handleChange}
                    value={fields[controlId].id}
                    type='number'
                    min={0}
                    required
                />
                <Form.Text muted>
                    Insira o ID da imagem, ou 0 para valor nulo
                </Form.Text>
            </Form.Group>
            <Col lg={4} className='d-flex flex-column'>
                {(fields[controlId].url) ? (
                    <img
                        className='single mb-2'
                        src={fields[controlId].url}
                        alt={fields[controlId].caption}
                        title={fields[controlId].caption}
                    />
                ) : (fields[controlId].id === 0) ? (
                    <small className='my-auto'>
                        Sem imagem
                    </small>
                )
                    : (
                        <small className='my-auto'>
                            Imagem não existe
                        </small>
                    )
                }
            </Col>
        </Row>
    )
}

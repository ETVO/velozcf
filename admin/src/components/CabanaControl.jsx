import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Accordion, Form, Button, Row, Col } from 'react-bootstrap'

import { errors, fetchImage, handleFormChange, fieldsChange, fieldsChangeArray } from '../helpers'

import '../scss/Components.scss'
import { findRenderedDOMComponentWithClass } from 'react-dom/cjs/react-dom-test-utils.development'

const { forwardRef, useRef, useImperativeHandle } = React;

const imagesLink = '/images';

const initialFields = {
    nome: '',
    tamanho: '',
    quartos: '',
    valor_base: 0,
    disponivel: 1,
    reservada: 0,
    galeria: '',
    id_mapa: '',
    empreendimento: 0
}

const CabanaControl = forwardRef(({ index, nome, empId, cabanaChange }, ref) => {

    const [fields, setFields] = useState(initialFields);

    if (fields === initialFields) {
        fieldsChangeArray({nome: nome, id_mapa: 'cabana' + (index+1)}, ['nome', 'id_mapa'], fields, setFields);
    }

    const handleChange = (e) => {
        cabanaChange(e, fields, setFields);
    }

    return (
        <Accordion.Item className='CabanaControl' eventKey={index}>
            <Accordion.Header>{fields.nome}</Accordion.Header>
            <Accordion.Body>
                <Row className='form-row'>
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
                            placeholder='2 quartos'
                            type="text"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.requiredText}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Form.Group className='form-row' controlId="valor_base">
                    <Form.Label>Valor base (R$):</Form.Label>
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

                <Form.Group className='form-row' controlId="galeria">
                    <Form.Label>Galeria de fotos
                        (<Link
                            title='Consultar imagens'
                            to={imagesLink}
                            target="_blank" rel="noopener noreferrer"
                        >
                            <small>Consultar imagens</small>
                        </Link>):
                    </Form.Label>
                    <Form.Control onChange={handleChange}
                        value={fields.galeria}
                        type="text"
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.requiredText}
                    </Form.Control.Feedback>
                    <Form.Text muted>
                        Insira os IDs das imagens, separados por vírgulas.
                    </Form.Text>
                </Form.Group>

                <Form.Group className='form-row' controlId="id_mapa">
                    <Form.Label>ID Mapa:</Form.Label>
                    <Form.Control onChange={handleChange}
                        value={fields.id_mapa}
                        type="text"
                        title='Edição desabilitada'
                        disabled
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.requiredText}
                    </Form.Control.Feedback>
                    <Form.Text muted>
                        ID do elemento na ilustração SVG.
                    </Form.Text>
                </Form.Group>
            </Accordion.Body>
        </Accordion.Item>
    )
});

export default CabanaControl;
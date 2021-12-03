import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'

import { fetchImage } from '../helpers'

import '../scss/Components.scss'

export default function GalleryControl({ label, controlId, controlFeedback, required, fields, setFields }) {

    const handleChange = (e) => {
        e.preventDefault()
        let formValues = JSON.parse(JSON.stringify(fields))
        let { value, id, type } = e.target

        let images = value.split(',');
        images = images.map(image => {
            var image_id = image.trim();
            if(image_id !== '') {
                return parseInt(image_id);
            }
            return false;
        });

        images.forEach(value => {
            if (value != 0) {
                fetchImage(value).then(data => {
                    if (data.success === false) { // Image not found
                        formValues[id].push({
                            valid: false,
                            id: value
                        });
                    }
                    else { // Image found
                        formValues[id].push({
                            id: data.id,
                            url: data.url,
                            caption: data.caption
                        });
                    }
    
                    setFields(formValues)
                })
            }
            else { // Image not set
    
                formValues[id].push({
                    id: 0
                });
    
                setFields(formValues)
            }
        });
    }

    return (
        <Row className='GalleryControl form-row'>
            <Form.Group as={Col} lg={8} controlId={controlId}>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                    onChange={handleChange}
                    value={fields[controlId].map(image => image.id).join(',')}
                    type='text'
                    required
                />
                <Form.Text muted>
                    Insira o ID da imagem, ou 0 para valor nulo
                </Form.Text>
            </Form.Group>
            <Col lg={4} className='d-flex flex-column'>
                {/* {(fields[controlId].url) ? (
                    <div className="multiple">
                        {(getGalleryArray.map(image => {

                        }))}
                    </div>
                    <img
                        className='multiple mb-2'
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
                } */}
            </Col>
        </Row>
    )
}

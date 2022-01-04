import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'

import { fetchImage } from '../helpers/helpers'

import '../scss/Components.scss'

export default function GalleryControl({ label, controlId, controlFeedback, required, fields, setFields }) {

    const handleChange = (e) => {
        e.preventDefault()
        let formValues = JSON.parse(JSON.stringify(fields))
        let { value, id } = e.target

        formValues[id] = value;

        setFields(formValues)
    }

    return (
        <Form.Group className='GalleryControl form-row' controlId={controlId}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                onChange={handleChange}
                value={fields[controlId]}
                type='text'
                placeholder='1,2,3'
                required
            />
            <Form.Text muted>
                Insira os IDs das imagens separados por vírgula (,)
            </Form.Text>
        </Form.Group>
    )
}

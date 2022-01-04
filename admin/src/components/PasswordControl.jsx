import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

import { errors, fetchImage } from '../helpers/helpers'

import '../scss/Components.scss'

/** to-do... TEST AND SHOW TESTS */
// const initialTests = [
//     {
//         name: '1 letra minúscula',
//         regex: /[a-z]/g,
//         pattern: '(?=.*[a-z])',
//         valid: false
//     },
//     {
//         name: '1 letra maiúscula',
//         regex: /[a-z]/g,
//         pattern: '(?=.*[a-z])'
//     },
// ];

export default function PasswordControl({ classes, label, controlId, handleChange, editMode = false, showHelp = true }) {

    const [view, setView] = useState(false);
    const [value, setValue] = useState('')
    const [length, setLength] = useState(false);
    const [number, setNumber] = useState(false);
    const [symbol, setSymbol] = useState(false);
    const [uppercase, setUppercase] = useState(false);

    /** filter and actions before handling change */
    const filterChange = (e) => { 
        let { value } = e.target;

        setLength(value.length >= 8);
        setUppercase(value.match(/[A-Z]/g));
        setNumber(value.match(/[0-9]/g));
        setSymbol(value.match(/[!@#$%^&*._=+-]/g));

        setValue(value); 

        handleChange(e); 
    }

    /** get className depending on test state  */
    const getTestClass = (test) => {
        if(test) {
            return 'text-green';
        } else {
            return 'text-danger';
        }
    }
    
    return (
        <Form.Group className={'PasswordControl form-row ' + classes} controlId={controlId}>
            <Form.Label>{label}</Form.Label>
            <div className="control-area">
                <Form.Control onChange={filterChange}
                    type={(view) ? 'text' : 'password'}
                    value={value}
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    required={!editMode}
                />
                <span onClick={() => setView(!view)} 
                    className='toggle-view cursor-pointer' 
                    title={(view) ? 'Ocultar' : 'Exibir'}
                >
                    <span className={(view) ? 'bi-eye-fill' : 'bi-eye'}></span>
                </span>
            </div>
            {(showHelp) ? (
                <Form.Text className='text-dark'>
                    {(editMode) ? ((value === '') ? (
                        <span>Deixe em branco para manter inalterada.&nbsp;</span>
                    ) : (
                        <span>
                            <span className={getTestClass(length)}>No mínimo 8 caracteres</span>,
                            &nbsp;<span className={getTestClass(symbol)}>1 símbolo</span>,
                            &nbsp;<span className={getTestClass(number)}>1 número</span> e 
                            &nbsp;<span className={getTestClass(uppercase)}>1 letra maíscula</span>.
                        </span>
                    )) : (
                        <span>
                            <span className={getTestClass(length)}>No mínimo 8 caracteres</span>,
                            &nbsp;<span className={getTestClass(symbol)}>1 símbolo</span>,
                            &nbsp;<span className={getTestClass(number)}>1 número</span> e 
                            &nbsp;<span className={getTestClass(uppercase)}>1 letra maíscula</span>.
                        </span>
                    )}
                </Form.Text>
            ) : ''}
            <Form.Control.Feedback type="invalid">
                {errors.invalidPassword}
            </Form.Control.Feedback>
        </Form.Group>
    )
}

import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Accordion, Button } from 'react-bootstrap'

import CabanaControl from './CabanaControl';

import { handleFormChange } from '../helpers';

const { forwardRef, useRef, useImperativeHandle } = React;

const initialCabana = {
    index: 0,
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

const Cabanas = forwardRef((props, ref) => {

    const [cabanas, setCabanas] = useState([])

    useImperativeHandle(ref, () => ({

        saveChanges() {
            console.log("saveChanges...");
        }

    }));

    const cabanaChange = (e, fields, setFields) => {
        handleFormChange(e, fields, setFields);
    }

    const addCabana = () => {
        var tempCabanas = JSON.parse(JSON.stringify(cabanas));
        var newCabana = JSON.parse(JSON.stringify(initialCabana));
        
        newCabana.index = cabanas.length;
        newCabana.nome = 'Cabana ' + (cabanas.length + 1);
        tempCabanas.push(newCabana);

        setCabanas(tempCabanas);
    }

    return (
        <div className='Cabanas'>
            {(cabanas) ? (
                <Accordion className='mb-3'>
                    {cabanas.map(cabana => (
                        <CabanaControl
                            key={cabana.index}
                            index={cabana.index}
                            nome={cabana.nome}
                            empId={props.empId}
                            cabanaChange={cabanaChange}
                        />
                    ))}
                </Accordion>
            ) : ''}
            <Button variant='outline-dark' onClick={addCabana}>
                <small>Adicionar cabana</small>
            </Button>
        </div>
    )
});

export default Cabanas;
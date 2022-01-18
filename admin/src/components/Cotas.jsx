import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Accordion, Button } from 'react-bootstrap'

import CotaControl from './CotaControl';

import { handleFormChange, initialCota, apiCreate, apiUpdate, apiDelete } from '../helpers/helpers';
import useGet from '../hooks/useGet';

const { forwardRef, useRef, useImperativeHandle } = React;

async function deleteCota(id) {
    apiDelete(endpoint, id);
}

const API_URL = process.env.REACT_APP_API_URL

const endpoint = 'cotas';

const Cotas = forwardRef(({cabanaId}, ref) => {

    const {loading, error, data} = useGet(API_URL + endpoint + '/read.php?cabana_id=' + cabanaId);

    const [cotas, setCotas] = useState([])
    const [active, setActive] = useState(-1)

    useImperativeHandle(ref, () => ({

        saveChanges() {
            cotas.forEach(cota => {
                if (!cota.id) {
                    apiCreate(endpoint, cota).then(response => {
                        if (response) {
                            console.log('response:', response.message);
                        }
                    });
                }
                else {
                    apiUpdate(endpoint, cota);
                }
            })
        }

    }));

    if(loading) return (
        <div className='Cotas'>
            Carregando...
        </div>
    );
    if(error) return (
        <div className='Cotas'>
            Erro ao carregar.
        </div>
    );

    if(data.success && cotas.length === 0) {
        data.data.forEach(cota => {cota.index = cota.numero - 1});
        setCotas(data.data);
    }

    const cotaChangeHandle = (e, index) => {
        handleFormChange(e, cotas, setCotas);
    }

    const addCota = () => {
        var temp = JSON.parse(JSON.stringify(cotas));
        var newCota = JSON.parse(JSON.stringify(initialCota));
        
        newCota.index = cotas.length;
        newCota.numero = newCota.index + 1;
        newCota.cabana_id = cabanaId;
        temp.push(newCota);

        setCotas(temp);
        setActive(newCota.index)
    }

    const accordionChange = (key) => {
        if(active === key) 
            setActive(-1)
        else
            setActive(key)
    }

    const removeCota = (index) => {
        let temp = cotas.filter(cota => {
            if(cota.index !== index)
                return true;
            
            deleteCota(cota.id);
            return false
        });

        temp.forEach((cota, i) => {
            cota.index = i;
            cota.numero = i + 1;
        })

        setCotas(temp)
    }

    return (
        <div className='Cotas'>
            {(cotas.length > 0) ? (
                <Accordion className='mb-3' activeKey={active}>
                    {cotas.map(cota => (
                        <CotaControl
                            key={cota.index}
                            fields={cota}
                            cabanaId={cabanaId}
                            parentChangeHandle={cotaChangeHandle}
                            accordionChange={accordionChange}
                            removeCota={removeCota}
                        />
                    ))}
                </Accordion>
            ) : ''}
            <Button variant='outline-dark' onClick={addCota}>
                <small>Adicionar cota</small>
            </Button>
        </div>
    )
});

export default Cotas;
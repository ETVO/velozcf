import React, { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { formatNumber } from '../helpers/helpers'

import '../scss/CotasCabana.scss'

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

export default function CotasCabana({ cabana, selected, setSelected }) {

    let cotas = cabana.cotas

    if (!cotas) return (<p>Nenhuma cota foi encontrada.</p>)

    const changeSelect = (status, cota) => {
        if (status === 'd') {
            let newSelected = JSON.parse(JSON.stringify(selected))

            // get index of cabana element that has id property equal tocabana.id prop value
            var cabanaIndex = newSelected.cabanas.map(el => el.id).indexOf(cabana.id)

            // // cabanaProps contains all properties but cotas
            // const {cotas, ...cabanaProps} = cabana

            if (cabanaIndex === -1) { // cabana does not exist in cabanas array yet
                newSelected.cabanas.push({
                    ...cabana,
                    cotas: [cota]
                })
            } // cabana element already exists -> let's push this 'cota' in the 'cotas' array of this element
            else {
                // console.log(newSelected.cabanas[index].cotas.includes(simpleCota))

                var cotaIndex = newSelected.cabanas[cabanaIndex].cotas.map(c => c.id).indexOf(cota.id)

                if (cotaIndex !== -1) {
                    newSelected.cabanas[cabanaIndex].cotas.splice(cotaIndex, 1)
                }
                else {
                    newSelected.cabanas[cabanaIndex].cotas.push(cota)
                }
            }

            setSelected(newSelected)
        }
    }

    return (
        <div className='CotasCabana'>
            <Row className='cotas-row'>
                {cotas.map(cota => {

                    let cotaClassName = 'cota-option d-flex justify-content-evenly'

                    // view changeSelect function of this component for explanation comments
                    let newSelected = JSON.parse(JSON.stringify(selected));

                    var cabanaIndex = newSelected.cabanas.map(el => el.id).indexOf(cabana.id);

                    if (cota.status === 'd') {
                        cotaClassName += ' cota-disponivel';
                    } else
                        if (cota.status === 'r') {
                            cotaClassName += ' cota-reservada';
                        } else
                            if (cota.status === 'v') {
                                cotaClassName += ' cota-vendida';
                            }

                    // if index is diff than -1, cabana.id is in the cabana array of the selectedCotas array
                    if (cabanaIndex !== -1) {

                        var cotaIndex = newSelected.cabanas[cabanaIndex].cotas.map(c => c.id).indexOf(cota.id)

                        // cota is selected
                        if (cotaIndex !== -1) {

                            // cota is unavailable -> remove it from selectedCotas array
                            if (cota.status === 'r' || cota.status === 'v') {
                                newSelected.cabanas[cabanaIndex].cotas.splice(cotaIndex, 1)
                            }
                            // cota is available -> add selected className
                            else {
                                cotaClassName += ' selected'
                            }
                        }
                    }

                    return (
                        <Col sm={3} key={cota.id} className="cota-option-wrap" >
                            <div className={cotaClassName} title={'R$ ' + formatNumber(cota.valor)} onClick={() => changeSelect(cota.status, cota)}>
                                <div className="over-text">
                                    <span>{(cota.status === 'v') 
                                    ? 'Vendida' 
                                    : ((cota.status === 'r') 
                                        ? 'Reservada' 
                                        : '')
                                    }</span>
                                </div>
                                <div className="numero my-auto">
                                    <div className='text'>{cota.numero}</div>
                                    <div className="icon"><span className='bi bi-check-lg'></span></div>
                                </div>
                                <div className="datas my-auto">
                                    <div>{'R$ ' + formatNumber(cota.valor)}</div>
                                </div>
                            </div>
                        </Col>
                    )
                })}
            </Row>
        </div>
    )
}

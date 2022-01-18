import React from 'react'

import { cycleCotas } from '../helpers/cabanas'
import { formatNumber } from '../helpers/helpers'

import '../scss/ListCabanas.scss'

const API_URL = process.env.REACT_APP_API_URL

export default function ListCabanas({ selected, cabanas, showUnidade }) {
    return (
        <div className="ListCabanas">
            {(cabanas) ? cabanas.map(uni => {

                let selecionada = selected.cabanas.map(el => { if (el.cotas.length > 0) return el.id; else return -1; }).indexOf(uni.id) !== -1

                let { status, available } = cycleCotas(uni);

                return (

                    <div key={uni.id} className={'unidade-card' + ((!uni.disponivel || status === 'v') ? ' muted' : '')} onClick={() => showUnidade(uni)}>
                        <div className={'foto' + ((selecionada) ? ' selected' : '')}>
                            <img src={uni.imagem.url} />
                            <div className="icon">
                                <span className='bi bi-check-lg'></span>
                            </div>
                        </div>
                        <div className="info">
                            <div className='nome'>
                                Cabana {uni.numero}
                            </div>
                        </div>
                        <div className="tag">
                            {
                                (status === 'v') ? (
                                    <span className='vendida'>100% Vendida</span>
                                ) : (
                                    (available === 0 || available > 1) ? (
                                        <span className='disponivel'>{available} Disponíveis</span>
                                    ) : (
                                        <span className='disponivel'>{available} Disponível</span>
                                    )
                                )
                            }
                        </div>
                    </div>
                )
            }) : (
                <p>Carregando...</p>
            )}
        </div>
    )
}

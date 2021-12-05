import React from 'react'

import { cycleCotas } from '../helpers/cabanas'
import { formatNumber } from '../helpers'

import '../scss/ListCabanas.scss'

const API_URL = process.env.REACT_APP_API_URL

export default function ListCabanas({selected, cabanas, showUnidade}) {
    return (
        <div className="ListCabanas">
            {(cabanas) ? cabanas.map(uni => {

                let selecionada = selected.cabanas.map(el => { if(el.cotas.length > 0) return el.id; else return -1; }).indexOf(uni.id) !== -1

                return (

                    <div key={uni.id} className={'unidade-card' + ((uni.reservada || !uni.disponivel) ? ' muted' : '')} onClick={() => showUnidade(uni)}>
                        <div className={'foto' + ((selecionada) ? ' selected' : '')}>
                            <img src={uni.imagem.url} />
                            <div className="icon">
                                <span className='bi bi-check-lg'></span>
                            </div>
                        </div>
                        <div className="info">
                            <div className='nome'>
                                {uni.nome}
                            </div>
                            <div className="caracter">
                                {uni.tamanho}&nbsp;&nbsp;{uni.quartos}
                            </div>
                            <div className="valor-base">
                                {'R$ ' + formatNumber(uni.valor_base)}
                            </div>
                        </div>
                        <div className="tag">
                            {
                                (uni.reservada) ? (
                                    <span className='reservada'>RESERVADA</span>
                                ) : (
                                    (uni.disponivel) ? (
                                        <span className='disponivel'>DISPONÍVEL</span>
                                    )
                                        : (
                                            <span className='vendida'>VENDIDA</span>
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

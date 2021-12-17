import React, { useState } from 'react'
import { Col, Row, Toast, Button, Container } from 'react-bootstrap'
import { useParams, Link } from 'react-router-dom'
import { ReactSVG } from 'react-svg';

import '../scss/Empreendimento.scss'

// hooks
import useGet from '../hooks/useGet';

// helpers & functions
import { apiRead, formatNumber, apiReadSingle } from '../helpers';
import { CabanaIcon, cycleCotas } from '../helpers/cabanas';

// components
import GalleryCabana from '../components/GalleryCabana';
import CotasCabana from '../components/CotasCabana';
import FilterCabanas from '../components/FilterCabanas'
import ListCabanas from '../components/ListCabanas'
import MapEmpreendimento from '../components/MapEmpreendimento'

const initialEmpreendimento = {
    nome: '',
    endereco: '',
    area_cabana: '',
    map_slug: '',
    logo: {
        id: 0
    },
    cover: {
        id: 0
    },
};

const initialSelected = {
    cabanas: []
}

const API_URL = process.env.REACT_APP_API_URL;

export default function Empreendimento() {
    const { id } = useParams()

    const { loading, error, data } = useGet(API_URL + 'cabanas/read.php?empreendimento=' + id)


    const [cabanas, setCabanas] = useState()
    const [empreendimento, setEmpreendimento] = useState(initialEmpreendimento)

    // active cabana
    const [active, setActive] = useState()

    // selected cabanas & cotas
    const [selected, setSelected] = useState(initialSelected)

    // toast states
    const [toastShow, setToastShow] = useState(false)
    const [toastText, setToastText] = useState('Empreendimento');

    // conditions in which the page cannot be displayed normally
    if (loading) {
        return (
            <div className='Empreendimento d-flex h-100'>
                <p className='m-auto'>Carregando...</p>
            </div>
        )
    }
    if (error) {
        return (
            <div className='Empreendimento d-flex h-100'>
                <p className='m-auto'>Ocorreu um erro ao carregar a página.</p>
            </div>
        )
    }
    if (data.success === false) {
        window.href.location = '/'
    }

    /** read cotas for cabanas */
    (async () => {
        if (!cabanas) {
            let tmp = data.data

            // read cotas for each cabana
            await tmp.forEach(async cabana => {
                let { data: cotas } = await apiRead('cotas', "?cabana_id=" + cabana.id)

                // store cotas as a property of cabana
                cabana.cotas = cotas;
            })

            // set cabanas accordingly
            setCabanas(tmp)
        }

        let storedSelected = JSON.parse(sessionStorage.getItem('selectedUnidades'))

        if (selected === initialSelected && storedSelected) {
            if (storedSelected.empreendimentoId === id) {
                setSelected(storedSelected.selected)
            }
        }
    })();

    /** set selected cotas */
    const setSelectedFilter = selected => {
        if (selected) {
            let selectedJSON = JSON.stringify({
                empreendimentoId: id,
                selected: selected
            })

            sessionStorage.setItem('selectedUnidades', selectedJSON)
            setSelected(selected)
        }
        // if selected is null, clear selection
        else {
            sessionStorage.removeItem('selectedUnidades')
            setSelected(initialSelected)
        }
    }

    /** clear selected cotas */
    const limparClick = e => {
        if (window.confirm('Deseja realmente limpar a sua seleção de cotas?')) {
            setSelectedFilter(null);
        }
    }

    /** function called to show unidade */
    const showUnidade = uni => {
        // check if unidade is sold out of cotas
        let disponivel = cycleCotas(uni);

        if (uni.reservada) {
            setToastShow(true)
            setToastText('A unidade selecionada encontra-se reservada.')
        }
        else if (!disponivel) {
            setToastShow(true)
            setToastText('A unidade selecionada já foi vendida.')

        }
        // if it's available, set it as active
        else {
            setActive(uni)
        }
    }

    /** calculate total price of selected cotas */
    const totalPrice = () => {
        let price = 0;
        if (selected) {
            selected.cabanas.map(cabana => {
                cabana.cotas.map(cota => {
                    price += cota.valor;
                })
            })
        }
        return price;
    }

    /** count the amount of selected cotas */
    const countSelected = () => {
        let count = 0
        if (selected) {
            selected.cabanas.map(cabana => {
                count += cabana.cotas.length
            })
        }
        return count
    }

    (async () => {
        if (empreendimento === initialEmpreendimento) {
            apiReadSingle('empreendimentos', id).then(res => {
                setEmpreendimento(res);
            });
        }
    })();

    return (
        <div className='Empreendimento'>
            <Toast onClose={() => setToastShow(false)} show={toastShow} delay={5000} autohide>
                <Toast.Header className='text-warning'>
                    <span className="bi bi-lightbulb me-2"></span>
                    <strong className="me-auto">Sistema Veloz</strong>
                </Toast.Header>
                <Toast.Body>{toastText}</Toast.Body>
            </Toast>
            <Row>
                <Col lg={4} className='unidades'>

                    {(active) ? (
                        <div className="inner selection">
                            <div className="heading">
                                <div className='back-button' onClick={() => setActive()}>
                                    <span className='bi bi-chevron-left me-1'></span>
                                    Lista de unidades
                                </div>

                                <div className="title mt-3">
                                    <h4 className='d-flex align-items-center'>
                                        <CabanaIcon className='icon' />
                                        <span className='ms-2'>{active.nome}</span>
                                    </h4>
                                </div>
                                <div className="gallery">
                                    <GalleryCabana id={'galleryCabana' + active.id} galeria={active.galeria} />
                                </div>
                            </div>

                            <div className="cotas">
                                <div className="cotas-title">
                                    <h6>Cotas</h6>
                                </div>
                                <CotasCabana cabana={active} selected={selected} setSelected={setSelectedFilter} />
                            </div>
                        </div>
                    ) : (
                        <div className="inner no-selection">
                            <div className="heading">
                                <div className="d-flex">
                                    <h1>Unidades</h1>
                                    <Button className='m-auto me-0 limpar' onClick={limparClick}>
                                        limpar seleção
                                    </Button>
                                </div>
                                <FilterCabanas cabanas={data.data} setCabanas={setCabanas} />
                            </div>

                            <ListCabanas selected={selected} cabanas={cabanas} showUnidade={showUnidade} />

                        </div>
                    )}

                    <div className={'overview d-flex justify-content-between' + ((totalPrice() === 0) ? ' disabled' : '')}>
                        <div className="price">
                            {'R$ ' + formatNumber(totalPrice())}
                        </div>
                        <div className="action">
                            <Link
                                disabled={(totalPrice() === 0)}
                                className='btn btn-primary'
                                to={((totalPrice() > 0) ? ('/proposta/' + id) : '')}
                            >
                                enviar proposta
                            </Link>
                        </div>
                    </div>

                </Col>
                <Col lg={8} className='mapa'>
                    {/* <div className="svg"></div> */}
                    {/* <img src={mapUrl} alt="" /> */}
                    <MapEmpreendimento mapSlug={empreendimento.map_slug} />
                    <div className="count-wrap">
                        <div className="count">
                            Cotas selecionadas
                            <div className={'count-number ms-2 rounded-circle' + ((countSelected() === 0) ? ' zero' : '')}>
                                <span>{countSelected()}</span>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    )

}
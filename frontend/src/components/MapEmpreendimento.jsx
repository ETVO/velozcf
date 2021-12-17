import React, { useState } from 'react'
import map from '../assets/urubici/map_urubici.svg';

// styling
import '../scss/MapEmpreendimento.scss'

const MAPS_URL = process.env.REACT_APP_MAPS_URL;

export default function MapEmpreendimento({ mapSlug }) {

    const mapUrl = MAPS_URL + mapSlug + '/map_' + mapSlug + '.svg';

    if (mapSlug === '') {
        return '';
    }

    return (
        <div className="MapEmpreendimento">
            <canvas className='canvas' id='mapCanvas'></canvas>
            {/* <iframe className='map-svg-wrap' title="Mapa do Empreendimento" id='mapFrame' src={mapUrl} frameBorder="0"></iframe> */}
            <object className='map-svg-wrap' id="mapFrame" data={map} type="image/svg+xml"></object>
        </div>
    )
}

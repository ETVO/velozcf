import React, { useState } from 'react'

// styling
import '../scss/MapEmpreendimento.scss'

const MAPS_URL = process.env.PUBLIC_URL + '/assets/';

export default function MapEmpreendimento({ mapSlug, active, showUnidade, cabanas, setCabanas, selected }) {

    const mapUrl = MAPS_URL + mapSlug + '/map_' + mapSlug + '.svg';

    const [mapActive, setMapActive] = useState(null);

    if (mapSlug === '') {
        return '';
    }

    const frame = document.getElementById('mapFrame');


    const zoom = (scale, centerX = null, centerY = null) => {
        if (frame) {
            let transformMatrix = [1, 0, 0, 1, 0, 0];
            var idoc = frame.contentDocument;
            let svg = idoc.getElementsByTagName('svg')[0];

            if (svg) {
                var viewbox = svg.getAttribute("viewBox").split(" ");
                if (centerX == null) centerX = parseFloat(viewbox[2]) / 2;
                if (centerY == null) centerY = parseFloat(viewbox[3]) / 2;
                var matrixGroup = svg.getElementById("matrix-group");

                var currentTransform = matrixGroup.getAttribute('transform').replace('matrix', '').replace('(', '').replace(')', '');
                currentTransform = currentTransform.split(' ');

                for (var i = 0; i < currentTransform.length; i++) {
                    currentTransform[i] = parseFloat(currentTransform[i]);
                    currentTransform[i] *= scale;
                }
                currentTransform[4] += (1 - scale) * centerX;
                currentTransform[5] += (1 - scale) * centerY;

                var newMatrix = "matrix(" + currentTransform.join(' ') + ")";
                matrixGroup.setAttribute('transform', newMatrix);

            }
        }
    }

    const centerOn = (scale, x, y) => {
        console.log('x', x, ' \ny', y);

        if (frame) {
            var idoc = frame.contentDocument;
            let svg = idoc.getElementsByTagName('svg')[0];

            if (svg) {
                var viewbox = svg.getAttribute("viewBox").split(" ");
                const centerX = parseFloat(viewbox[2]) / 2;
                const centerY = parseFloat(viewbox[3]) / 2;

                var px = (-x > centerX) ? centerX + x : centerX - x;
                var py = (-y > centerY) ? centerY + y : centerY - y;
                
                zoom(scale, px, py)

            }
        }
    }

    const reset = () => {
        if (frame) {
            let transformMatrix = [1, 0, 0, 1, 0, 0];
            var idoc = frame.contentDocument;
            let svg = idoc.getElementsByTagName('svg')[0];

            if (svg) {
                var matrixGroup = svg.getElementById("matrix-group");
                var newMatrix = "matrix(" + transformMatrix.join(' ') + ")";
                matrixGroup.setAttribute('transform', newMatrix);
            }
        }
    }

    const pan = (dx, dy) => {
        if (frame) {
            var idoc = frame.contentDocument;
            let svg = idoc.getElementsByTagName('svg')[0];

            if (svg) {
                var matrixGroup = svg.getElementById("matrix-group");

                var currentTransform = matrixGroup.getAttribute('transform').replace('matrix', '').replace('(', '').replace(')', '');
                currentTransform = currentTransform.split(' ');

                for (var i = 0; i < currentTransform.length; i++) {
                    currentTransform[i] = parseFloat(currentTransform[i]);
                }
                currentTransform[4] += dx;
                currentTransform[5] += dy;

                var newMatrix = "matrix(" + currentTransform.join(' ') + ")";
                matrixGroup.setAttribute('transform', newMatrix);

            }
        }
    }

    if (frame) {

        const frameUpdate = () => {
            var idoc = frame.contentDocument;

            if (active != null) {
                if(mapActive != active) {    
                    setMapActive(active);
                }
            }

            // Get all cabanas from empreendimento and set their map respectives
            cabanas.map(cabana => {
                let mapCabana = idoc.getElementById(cabana.id_mapa);

                if (mapCabana) {
                    mapCabana.addEventListener('click', e => {
                        showUnidade(cabana);
                    });

                    let selecionada = selected.cabanas.map(el => {
                        if (el.cotas.length > 0)
                            return el.id;
                        else
                            return -1;
                    }
                    ).indexOf(cabana.id) !== -1;

                    if (selecionada) {
                        mapCabana.setAttribute('xlink:href', '#cabana_selected')
                        mapCabana.setAttribute('title', cabana.nome + ' Selecionada')
                    }
                    else if(active != null && cabana.id_mapa === active.id_mapa) {
                        mapCabana.setAttribute('xlink:href', '#cabana_selected')
                        mapCabana.setAttribute('title', cabana.nome + ' Ativa')
                    }
                    else if (cabana.disponivel && !cabana.reservada) {
                        mapCabana.setAttribute('xlink:href', '#cabana_disp')
                        mapCabana.setAttribute('title', cabana.nome + ' Disponível')
                    }
                    else {
                        mapCabana.setAttribute('xlink:href', '#cabana_indisp')
                        mapCabana.setAttribute('title', cabana.nome + ' Indisponível')
                    }
                }

            })

        }

        frame.contentWindow.onload = frameUpdate;
        frameUpdate();
    }

    return (
        <div className="MapEmpreendimento">
            <object
                className='map-svg-wrap'
                id="mapFrame"
                data={mapUrl}
                aria-label="Mapa do Empreendimento"
                type="image/svg+xml"
            >
            </object>

            <div className="caption">
                <h6 className='m-0'>Legenda</h6>
                <div className='caption-row'>
                    <span className="color" id='disp'></span>
                    <span className='text'>Disponível</span>
                </div>
                <div className='caption-row'>
                    <span className="color" id='selected'></span>
                    <span className='text'>Selecionado</span>
                </div>
                <div className='caption-row'>
                    <span className="color" id='indisp'></span>
                    <span className='text'>Indisponível</span>
                </div>
            </div>

            <div className="zoom-controls">
                <button title='Aumentar zoom' id='zoomIn' onClick={() => zoom(1.25)}><span className='bi-plus-lg'></span></button>
                <button title='Diminuir zoom' id='zoomOut' onClick={() => zoom(0.9)}><span className='bi-dash-lg'></span></button>
            </div>
            <div className="pan-controls">
                <button title='Deslocar para cima' id='panUp' onClick={() => pan(0, 150)}><span className='bi-chevron-up'></span></button>
                <button title='Deslocar para baixo' id='panDown' onClick={() => pan(0, -150)}><span className='bi-chevron-down'></span></button>
                <button title='Deslocar para a esquerda' id='panLeft' onClick={() => pan(150, 0)}><span className='bi-chevron-left'></span></button>
                <button title='Deslocar para a direita' id='panRight' onClick={() => pan(-150, 0)}><span className='bi-chevron-right'></span></button>
            </div>

            <div className="center-control">
                <button title='Redefinir posição' id='center' onClick={() => reset()}><span className='bi-arrow-counterclockwise'></span></button>
            </div>

        </div>
    )
}

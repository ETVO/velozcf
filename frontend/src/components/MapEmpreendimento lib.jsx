import { useRef, useState, useEffect } from 'react';
import { INITIAL_VALUE, ReactSVGPanZoom, TOOL_NONE } from 'react-svg-pan-zoom';
import { ReactSvgPanZoomLoader } from 'react-svg-pan-zoom-loader'

const MAPS_URL = process.env.PUBLIC_URL + '/assets/';

export default function MapEmpreendimento({ mapSlug, active, showUnidade, cabanas, setCabanas, selected }) {
    const mapUrl = MAPS_URL + mapSlug + '/map_' + mapSlug + '.svg';

    const Viewer = useRef(null);
    const [tool, setTool] = useState(TOOL_NONE)
    const [value, setValue] = useState(INITIAL_VALUE)

    useEffect(() => {
        Viewer.current.fitToViewer();
    }, []);

    /* Read all the available methods in the documentation */
    const _zoomIn = () => Viewer.current.zoomOnViewerCenter(1.1)
    const _zoomOut = () => Viewer.current.zoomOnViewerCenter(0.9)

    return (
        <div>

            {/* <button className="btn" onClick={() => _zoomIn()}><span className='bi-plus-lg'></span></button>
            <button className="btn" onClick={() => _zoomOut()}><span className='bi-dash-lg'></span></button> */}

            <ReactSvgPanZoomLoader src={mapUrl} render={(content) => (
                <ReactSVGPanZoom
                    ref={Viewer}
                    width={500} height={500}
                    tool={tool} onChangeTool={setTool}
                    value={value} onChangeValue={setValue}
                    onZoom={e => console.log('zoom')}
                    onPan={e => console.log('pan')}
                    onClick={event => console.log('click', event.x, event.y, event.originalEvent)}
                >
                    <svg width={500} height={500}>
                        { content }
                    </svg>
                </ReactSVGPanZoom>
            )} />

            <ReactSVGPanZoom
                ref={Viewer}
                width={500} height={500}
                tool={tool} onChangeTool={setTool}
                value={value} onChangeValue={setValue}
                onZoom={e => console.log('zoom')}
                onPan={e => console.log('pan')}
                onClick={event => console.log('click', event.x, event.y, event.originalEvent)}
            >
            </ReactSVGPanZoom>
        </div>
    )
}
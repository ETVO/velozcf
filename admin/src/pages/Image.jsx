import React, { useState } from 'react'
import { Container, Form, Col, Row, Button, FloatingLabel } from 'react-bootstrap'
import { useParams, Link } from 'react-router-dom'
import moment from 'moment'
import reactImageSize from 'react-image-size'

import useGet from '../hooks/useGet'
import { handleFormChange, apiCreate, apiUpdate, apiDelete, fieldsChangeArray } from '../helpers/helpers'

import '../scss/View.scss'
import { useNavigate } from 'react-router-dom'

const API_URL = process.env.REACT_APP_API_URL

const IMAGE_INPUT_ACCEPT = 'image/*'

const archiveLink = '/images'
const singleLink = '/image'
const endpoint = 'imagens'

function getFileSize(bytes, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
}

const initialFields = {
    url: '',
    caption: '',
    filename: ''
};

const initialDimensions = {
    w: 0,
    h: 0
};

const errors = {
    requiredText: 'Campo obrigatório'
}

function Image() {

    const { id } = useParams()

    const navigate = useNavigate();

    let editMode = (typeof id !== 'undefined');

    const [fields, setFields] = useState(initialFields);
    const [dimensions, setDimensions] = useState(initialDimensions);
    const [validated, setValidated] = useState(false);

    const { loading, error, data } = useGet(API_URL + endpoint + '/read_single.php?id=' + id);

    if (fields.url !== '' && dimensions === initialDimensions) {
        reactImageSize(fields.url).then(({ width, height }) => {

            setDimensions({ w: width, h: height });
        });
    }

    if (editMode && loading) return (
        <Container className='Image ViewSingle my-5'>
            <p>Carregando...</p>
        </Container>
    );
    if (editMode && error) return (
        <Container className='Image ViewSingle my-5'>
            <p>Erro ao carregar.</p>
        </Container>
    );

    if (editMode && data && fields === initialFields) {
        setFields(data)
    }


    async function deleteImage(id, permanently = false) {
        if (window.confirm('AÇÃO IRREVERSÍVEL!\nDeseja realmente excluir esta imagem PERMANENTEMENTE?')) {
            apiDelete(endpoint, id).then(res => {
                alert(res.message);
                navigate(archiveLink);
            })
        }
    }

    const handleSubmit = (e) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true)
        }
        else {

            if (editMode) {
                e.preventDefault();
                apiUpdate(endpoint, fields, data).then(response => {
                    if (response) {

                        alert(response.message);
                        if (response.success !== false)
                            navigate(singleLink + '/' + data.id);
                    }
                })
            }
        }
    }

    const handleChange = (e) => {
        handleFormChange(e, fields, setFields)
    }

    const handleFileChange = (e) => {
        e.preventDefault();
        let selectedFile = e.target.files[0];

        let url = window.URL.createObjectURL(selectedFile);
        let size = selectedFile.size;
        let filename = selectedFile.name;

        fetch(url).then(async (r) => {
            let blob = await r.blob();
        });

        fieldsChangeArray({
            url: url,
            size: size,
            filename: filename,
        }, ['url', 'size', 'filename'], fields, setFields);
    }

    // console.log(JSON.stringify(fields))

    return (
        <Container className='Image View Single my-5'>

            <Form
                onSubmit={handleSubmit}
                action={(!editMode) ? API_URL + endpoint + '/create.php' : null}
                method='post'
                encType='multipart/form-data'
                noValidate
                validated={validated}>
                <div className="d-flex flex-column flex-md-row heading">
                    <div className="d-flex m-auto ms-md-0">
                        <h1 className='title'>{(editMode) ? 'Alterar' : 'Nova'} Imagem</h1>
                        <span className='m-auto ms-3'>
                            <Link className='icon' title='Voltar' to={archiveLink}>
                                <span className='bi-arrow-left'></span> Voltar
                            </Link>
                        </span>
                    </div>

                    <span className='m-auto mt-2 mt-sm-auto me-md-0'>
                        <Button variant='primary' type="submit">
                            {(editMode) ? 'Atualizar' : 'Salvar'}
                        </Button>
                        <Button
                            variant='outline-danger'
                            className='ms-2'
                            type="button"
                            disabled={(!editMode)}
                            onClick={() => { if (editMode) deleteImage(data.id) }}>
                            Excluir
                        </Button>
                    </span>
                </div>

                <Row className='single-inner'>
                    <Col className='edit'>

                        <Form.Group className='form-row' controlId="caption">
                            <Form.Label>Legenda:</Form.Label>
                            <Form.Control onChange={handleChange}
                                value={fields.caption}
                                as="textarea"
                                name='caption'
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.requiredText}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {(editMode) ? (
                            <Form.Group className='form-row'>
                                <Form.Label>Imagem:</Form.Label>
                                <Form.Text muted>
                                    <div className='mb-1'>
                                        Dimensões: <b>{dimensions.w}</b> x <b>{dimensions.h}</b>
                                        <br />
                                        Tamanho: <b>{getFileSize(fields.size)}</b>
                                    </div>
                                </Form.Text>
                                <img className='d-block w-100' src={fields.url} alt={fields.caption} />
                            </Form.Group>
                        ) : (
                            <div>
                                <Form.Group className='form-row' controlId="file">
                                    <Form.Label>Escolher imagem:</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name='file'
                                        accept={IMAGE_INPUT_ACCEPT}
                                        onChange={handleFileChange}
                                    />
                                    {(fields.url !== '') ? (
                                        <Form.Text muted>
                                            <div className='mt-1'>Dimensões: <b>{dimensions.w}</b> x <b>{dimensions.h}</b></div>
                                            <div>Tamanho: <b>{getFileSize(fields.size)}</b></div>
                                            <div className='mt-1'>
                                                <img className='d-block w-100' src={fields.url} alt={fields.caption} />
                                            </div>
                                        </Form.Text>
                                    ) : ''}
                                </Form.Group>
                                <input type="hidden" name="redirect" value={window.location.href} />
                            </div>
                        )}

                    </Col>
                    <Col className='options'>

                        <div className="d-flex flex-column">
                            <div className="ms-auto">
                                {(editMode && data) ? (
                                    <div className='mt-2 text-end'>
                                        <small className='text-muted'>Última atualização:</small>
                                        <div>{moment(data.updated_at).format('DD/MM/YYYY HH:mm')}</div>
                                    </div>
                                ) : ''}
                            </div>
                        </div>

                    </Col>
                </Row>
            </Form>
        </Container>
    )
}

export default Image

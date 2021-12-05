import React, { useState } from 'react'
import { Form, Col, Row, Button } from 'react-bootstrap'
import InputMask from 'react-input-mask';
import moment from 'moment'

import { errors } from '../helpers';

const estado_civil_options = ['Solteiro', 'Casado', 'Separado', 'Divorciado', 'Viúvo'];

export default function DadosComprador({ fields, setFields, submit }) {

    let minDataNasc = moment().subtract(105, 'years')
    let maxDataNasc = moment().subtract(18, 'years')

    const [conjuge, setConjuge] = useState(fields.estado_civil === 'Casado');
    const [validated, setValidated] = useState(false);

    const handleSubmit = e => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            setValidated(true)
        }
        else {
            submit()
        }
    }

    const handleChange = e => {
        e.preventDefault()
        let formValues = JSON.parse(JSON.stringify(fields))
        let { value, id } = e.target

        // If there are dots in the input id, use it to 
        // assign the value to a property one-level deeper
        if (id.indexOf('.') !== -1) {
            let ids = id.split('.')
            let id1 = ids[0]
            let id2 = ids[1]
            formValues[id1][id2] = value;
        }
        // Else, just assign it normally
        else {
            formValues[id] = value;
        }

        // show/hide conjuge fields depending on the estado_civil value
        if (id === 'estado_civil') setConjuge(value === 'Casado')

        setFields(formValues)
    }

    return (
        <div className='DadosComprador'>
            <h3>Preenchimento de dados da proposta</h3>

            <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <div className="form-section mb-4">
                    <div className="section-title">
                        <h5>Comprador</h5>
                    </div>
                    <div className="section-content">
                        <Form.Group className="form-row" controlId="comprador.nome_completo">
                            <Form.Label>Nome completo:</Form.Label>
                            <Form.Control onChange={handleChange} type="text" defaultValue={fields.comprador.nome_completo} placeholder="Nome Sobrenome" required />
                            <Form.Control.Feedback type="invalid">
                                {errors.requiredText}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Row className="form-row">
                            <Form.Group as={Col} lg={4} controlId="comprador.data_nasc">
                                <Form.Label>Data de nascimento:</Form.Label>
                                <Form.Control onChange={handleChange}
                                    type="date"
                                    defaultValue={fields.comprador.data_nasc}
                                    placeholder="DD/MM/AAAA"
                                    min={minDataNasc.format('YYYY-MM-DD')}
                                    max={maxDataNasc.format('YYYY-MM-DD')}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.invalidDate}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} controlId="comprador.nacionalidade">
                                <Form.Label>Nacionalidade:</Form.Label>
                                <Form.Control onChange={handleChange} type="text"
                                    defaultValue={fields.comprador.nacionalidade}
                                    placeholder="Brasileiro(a)" required />
                                <Form.Control.Feedback type="invalid">
                                    {errors.requiredText}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Form.Group className="form-row" controlId="comprador.profissao">
                            <Form.Label>Profissão:</Form.Label>
                            <Form.Control onChange={handleChange} type="text"
                                defaultValue={fields.comprador.profissao}
                                placeholder="Profissão" required />
                            <Form.Control.Feedback type="invalid">
                                {errors.requiredText}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="form-row" controlId="estado_civil">
                            <Form.Label>Estado civil:</Form.Label>
                            <Form.Control onChange={handleChange} as={Form.Select} required value={fields.estado_civil}>
                                {estado_civil_options.map(option => {
                                    return (
                                        <option key={option} value={option}>{option}</option>
                                    );
                                })}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.requiredText}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {(conjuge) ? (
                            <div className="casado-fields">
                                <Form.Group className="form-row" controlId="regime_casamento">
                                    <Form.Label>Regime de casamento:</Form.Label>
                                    <Form.Control onChange={handleChange} as={Form.Select} required defaultValue={fields.regime_casamento}>
                                        <option disabled value=''>Escolha uma opção</option>
                                        <option value="Comunhão total de bens">Comunhão total de bens</option>
                                        <option value="Comunhão parcial de bens">Comunhão parcial de bens</option>
                                        <option value="Separação de bens">Separação de bens</option>
                                        <option value="Participação final nos aquestos">Participação final nos aquestos</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.requiredText}
                                    </Form.Control.Feedback>
                                </Form.Group>


                                <div className="form-section">
                                    <div className="section-title">
                                        <h5>Cônjuge</h5>
                                    </div>
                                    <div className="section-content">
                                        <Form.Group className="form-row" controlId="conjuge.nome_completo">
                                            <Form.Label>Nome completo:</Form.Label>
                                            <Form.Control onChange={handleChange} type="text"
                                                defaultValue={fields.conjuge.nome_completo}
                                                placeholder="Nome Sobrenome" required />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.requiredText}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Row className="form-row">
                                            <Form.Group as={Col} lg={4} controlId="conjuge.data_nasc">
                                                <Form.Label>Data de nascimento:</Form.Label>
                                                <Form.Control onChange={handleChange}
                                                    type="date"
                                                    defaultValue={fields.conjuge.data_nasc}
                                                    placeholder="DD/MM/AAAA"
                                                    min={minDataNasc.format('YYYY-MM-DD')}
                                                    max={maxDataNasc.format('YYYY-MM-DD')}
                                                    required
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.requiredText}
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group as={Col} controlId="conjuge.nacionalidade">
                                                <Form.Label>Nacionalidade:</Form.Label>
                                                <Form.Control onChange={handleChange} type="text"
                                                    defaultValue={fields.conjuge.nacionalidade}
                                                    placeholder="Brasileiro(a)" />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.requiredText}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>

                                        <Form.Group className="form-row" controlId="conjuge.profissao">
                                            <Form.Label>Profissão:</Form.Label>
                                            <Form.Control onChange={handleChange} type="text"
                                                defaultValue={fields.conjuge.profissao}
                                                placeholder="Profissão" required />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.requiredText}
                                            </Form.Control.Feedback>
                                        </Form.Group>


                                        <Row className="form-row">
                                            <Form.Group as={Col} controlId="conjuge.cpf">
                                                <Form.Label>CPF:</Form.Label>
                                                <Form.Control onChange={handleChange}
                                                    as={InputMask}
                                                    defaultValue={fields.conjuge.cpf}
                                                    mask="999.999.999-99"
                                                    maskChar="_"
                                                    placeholder='000.000.000-00'
                                                    required
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.requiredText}
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group as={Col} controlId="conjuge.rg">
                                                <Form.Label>RG:</Form.Label>
                                                <Form.Control onChange={handleChange} type="text"
                                                    defaultValue={fields.conjuge.rg}
                                                    placeholder="0000000" required />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.requiredText}
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group as={Col} controlId="conjuge.orgao_exp">
                                                <Form.Label>Órgão Exp.:</Form.Label>
                                                <Form.Control onChange={handleChange} type="text"
                                                    defaultValue={fields.conjuge.orgao_exp}
                                                    placeholder="SSP/SC" required />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.requiredText}
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                        </Row>
                                    </div>
                                </div>
                            </div>
                        ) : ''}

                        <Row className="form-row">
                            <Form.Group as={Col} controlId="comprador.cpf">
                                <Form.Label>CPF:</Form.Label>
                                <Form.Control onChange={handleChange}
                                    as={InputMask}
                                    defaultValue={fields.comprador.cpf}
                                    mask="999.999.999-99"
                                    maskChar="_"
                                    placeholder='000.000.000-00'
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.requiredText}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} controlId="comprador.rg">
                                <Form.Label>RG:</Form.Label>
                                <Form.Control onChange={handleChange} type="text"
                                    defaultValue={fields.comprador.rg}
                                    placeholder="0000000" required />
                                <Form.Control.Feedback type="invalid">
                                    {errors.requiredText}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} controlId="comprador.orgao_exp">
                                <Form.Label>Órgão Exp.:</Form.Label>
                                <Form.Control onChange={handleChange} type="text"
                                    defaultValue={fields.comprador.orgao_exp}
                                    placeholder="SSP/SC" required />
                                <Form.Control.Feedback type="invalid">
                                    {errors.requiredText}
                                </Form.Control.Feedback>
                            </Form.Group>

                        </Row>

                        <Form.Group className="form-row" controlId="endereco">
                            <Form.Label>Endereço:</Form.Label>
                            <Form.Control onChange={handleChange} type="text"
                                defaultValue={fields.endereco}
                                placeholder="Rua, número, apartamento" required />

                            <Form.Control.Feedback type="invalid">
                                {errors.requiredText}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Row className="form-row">

                            <Form.Group as={Col} controlId="bairro">
                                <Form.Label>Bairro:</Form.Label>
                                <Form.Control onChange={handleChange} type="text"
                                    defaultValue={fields.bairro}
                                    placeholder="Bairro" required />
                                <Form.Control.Feedback type="invalid">
                                    {errors.requiredText}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} lg={3} controlId="cep">
                                <Form.Label>CEP:</Form.Label>
                                <Form.Control onChange={handleChange} type="text"
                                    defaultValue={fields.cep}
                                    placeholder="00000-000" required />
                                <Form.Control.Feedback type="invalid">
                                    {errors.requiredText}
                                </Form.Control.Feedback>
                            </Form.Group>

                        </Row>

                        <Form.Group className="form-row" controlId="cidade">
                            <Form.Label>Cidade:</Form.Label>
                            <Form.Control onChange={handleChange} type="text"
                                defaultValue={fields.cidade}
                                placeholder="Cidade/UF" required />
                            <Form.Control.Feedback type="invalid">
                                {errors.requiredText}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Row className="form-row">

                            <Form.Group as={Col} lg={4} controlId="telefone">
                                <Form.Label>Telefone:</Form.Label>
                                <Form.Control onChange={handleChange} type="text"
                                    defaultValue={fields.telefone}
                                    placeholder="(00) 00000-0000" required />
                                <Form.Control.Feedback type="invalid">
                                    {errors.requiredText}
                                </Form.Control.Feedback>
                            </Form.Group>

                        </Row>

                        <Form.Group className="form-row" controlId="email">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control onChange={handleChange} type="email"
                                defaultValue={fields.email}
                                placeholder="email.exemplo@dominio.com" required />
                            <Form.Control.Feedback type="invalid">
                                {errors.requiredText}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>

                </div>
                <Button className='ms-auto d-flex' type="submit">
                    <span className='my-auto'>seguinte</span>
                    <span className='my-auto ms-1 bi bi-chevron-right'></span>
                </Button>
            </Form>
        </div>
    )
}

import React, { useState, Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Navbar, Button, Nav } from 'react-bootstrap'
// styling

const API_URL = process.env.REACT_APP_API_URL
const SHOW_EMPRE = process.env.REACT_APP_SHOW_EMPRE

export default function Header({ token }) {

    let location = useLocation();

    const logo = {
        url: process.env.REACT_APP_SYSTEM_URL + '/public/images/logo_veloz.png',
        caption: 'Sistema Veloz'
    }

    return (
        <Navbar collapseOnSelect expand="md" variant="dark" bg="dark" className='Header px-4'>
            <Navbar.Brand>
                {(logo) ? (
                    <Link to='/'>
                        <img src={logo.url} alt={logo.caption} />
                    </Link>
                ) : (
                    <Link className='brand-text' to='/'>
                        {logo.caption}
                    </Link>
                )}
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className='justify-content-start'>
                <Nav activeKey={location.pathname}>
                    <Nav.Link as={Link} to='/' eventKey='/'>Home</Nav.Link>
                    {(token.role === 'venda') ?
                        <Fragment>
                            <Nav.Link as={Link} to={'/user/' + token.id} eventKey={'/user/' + token.id}>Meu Usuário</Nav.Link>
                        </Fragment>
                        :
                        <Fragment>
                            {(SHOW_EMPRE) ? (
                                <Nav.Link as={Link} to='/empreendimentos' eventKey='/empreendimentos'>Empreendimentos</Nav.Link>
                            ) : ''}
                            <Nav.Link as={Link} to='/cabanas' eventKey='/cabanas'>Cabanas</Nav.Link>
                            <Nav.Link as={Link} to='/images' eventKey='/images'>Imagens</Nav.Link>
                            <Nav.Link as={Link} to='/users' eventKey='/users'>Usuários</Nav.Link>
                            <Nav.Link as={Link} to='/imobiliarias' eventKey='/imobiliarias'>Imobiliárias</Nav.Link>
                            <Nav.Link as={Link} to='/propostas' eventKey='/propostas'>Propostas</Nav.Link>
                            <Nav.Link as={Link} to='/configuracoes' eventKey='/configuracoes'>Configurações</Nav.Link>
                        </Fragment>
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

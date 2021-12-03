import React, {useState} from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Navbar, Button, Nav } from 'react-bootstrap'
// styling

const API_URL = process.env.REACT_APP_API_URL

export default function Header() {

    let location = useLocation();

    return (
        <Navbar expand="md" variant="dark" bg="dark" className='Header px-4 py-2'>
            <Navbar.Brand>
                <Link to='/'>
                    Sistema Veloz
                </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className='justify-content-start d-flex'>
                <Nav activeKey={location.pathname}>
                    <Nav.Link as={Link} to='/' eventKey='/'>Home</Nav.Link>
                    <Nav.Link as={Link} to='/empreendimentos' eventKey='/empreendimentos'>Empreendimentos</Nav.Link>
                    <Nav.Link as={Link} to='/cabanas' eventKey='/cabanas'>Cabanas</Nav.Link>
                    <Nav.Link as={Link} to='/images' eventKey='/images'>Imagens</Nav.Link>
                    <Nav.Link as={Link} to='/propostas' eventKey='/propostas'>Propostas</Nav.Link>
                    <Nav.Link as={Link} to='/users' eventKey='/users'>Usuários</Nav.Link>
                    <Nav.Link as={Link} to='/imobiliarias' eventKey='/imobiliarias'>Imobiliárias</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

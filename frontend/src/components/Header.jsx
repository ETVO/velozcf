import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Button } from 'react-bootstrap'

import { fetchImage } from '../helpers/helpers';

// styling
import '../scss/Header.scss'

const API_URL = process.env.REACT_APP_API_URL

export default function Header({ setToken, token }) {
    
    const logOut = () => {
        if(window.confirm('Deseja realmente sair da sua conta?'))
            setToken(false);
    }

    const logo = {
        url: process.env.REACT_APP_BACKEND_URL + '/public/images/logo_veloz.png',
        caption: 'Sistema Veloz'
    } 

    return (
        <Navbar className='Header px-4 text-light' variant="dark" bg="dark" >
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
            <Navbar.Collapse className='justify-content-end'>
                <div className="logged-as">
                    <span className='name'>
                        {token.info.nome_completo}
                    </span>
                </div>
                <Button className="log-out" onClick={logOut}>
                    <span>
                        Sair
                    </span>
                    <span className='bi bi-arrow-bar-right'>

                    </span>
                </Button>
            </Navbar.Collapse>
        </Navbar>
    )
}

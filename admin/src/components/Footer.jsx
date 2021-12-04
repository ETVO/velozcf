import React, {useState} from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Navbar, Button, Nav } from 'react-bootstrap'
import moment from 'moment'

export default function Footer({setLoggedIn}) {

    const logOut = () => {
        sessionStorage.removeItem('loggedIn');
        setLoggedIn(false);
    }

    return (
        <footer className='Footer fixed-bottom px-4 py-2 text-light bg-dark d-flex'>
            <small className='user-info' title='Seu usuário'>
                velozadm <span className="text-muted">(Admin Veloz)</span>
            </small>
            <small className='m-auto text-center text-uppercase'>
                {moment().format('Y')} © CF Negócios Imobiliários.&nbsp;<br className='d-block d-sm-none'/>
                <span className="text-muted">Desenvolvido por <a href='https://imobmark.com.br/' rel="noreferrer" target='_blank'>Imobmark</a></span>
            </small>
            <small className='log-out text-uppercase' title='Fazer log-out' onClick={logOut}>
                Sair <span className='bi-arrow-bar-right'></span>
            </small>
        </footer>
    )
}

import React, {useState} from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Navbar, Button, Nav } from 'react-bootstrap'
import moment from 'moment'
import { apiReadSingle } from '../helpers';

export default function Footer({token, setToken}) {

    const logOut = () => {
        setToken(false);
    }

    return (
        <footer className='Footer fixed-bottom px-4 py-2 text-light bg-dark d-flex'>
            {(token) ?
                <small className='user-info' title='Seu usuário'>
                    {/* <small className='text-muted'>{token.role}</small>&nbsp; */}
                    {token.username}&nbsp;
                    {(token.info) ? <span className="text-muted">({token.info.nome_completo})</span> : '' }
                </small> 
            : '' }
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

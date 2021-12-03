import React, {useState} from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Navbar, Button, Nav } from 'react-bootstrap'
import moment from 'moment'

export default function Footer() {
    return (
        <footer className='Footer fixed-bottom px-4 py-2 text-light bg-dark d-flex text-uppercase'>
            <small className='m-auto text-center'>
                {moment().format('Y')} © CF Negócios Imobiliários.&nbsp;<br className='d-block d-sm-none'/>
                <span className="text-muted">Desenvolvido por <a href='https://imobmark.com.br/' rel="noreferrer" target='_blank'>Imobmark</a></span>
            </small>
        </footer>
    )
}

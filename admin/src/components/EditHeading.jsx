import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Navbar, Button, Nav } from 'react-bootstrap'
import moment from 'moment'

import '../scss/View.scss'

export default class EditHeading extends React.Component {
    render () {
        let { title, showReload = false, iconLink } = this.props;
        
        return <div className="d-flex flex-column flex-md-row heading">
            <div className="d-flex m-auto ms-md-0">
                <h1 className='title'>{title}</h1>
                <span className='m-auto ms-3'>
                    {(iconLink) ? (
                        <Link className='me-2 icon' title='Voltar' to={iconLink}>
                            <span className='bi-arrow-left'></span> Voltar
                        </Link>
                    ) : (showReload) ? (
                        <a className='icon reload' title='Recarregar' href=''>
                            <span className='mx-auto bi-arrow-clockwise'></span>
                        </a>
                    ) : ''}
                </span>
            </div>

            <span className='m-auto mt-2 mt-sm-auto me-md-0'>
                {this.props.children}
            </span>
        </div>
    }
}

import React, {useState} from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Navbar, Button, Nav } from 'react-bootstrap'
import moment from 'moment'

import '../scss/View.scss'

export default function ViewHeading({title, showReload, addNew = 'Adicionar', addNewLink}) {
    return (
        <div className="d-flex flex-column flex-md-row heading">
                <div className="d-flex flex-column flex-sm-row m-auto ms-md-0">
                    <h1 className='title'>{title}</h1>
                    {(showReload) ? (
                        <span className='m-auto ms-sm-3'>
                            <a className='icon reload d-none d-sm-block' title='Recarregar' href=''>
                                <span className='mx-auto bi-arrow-clockwise'></span>
                            </a>
                        </span>
                    ) : ''}
                </div>
                <span className='m-auto mt-2 mt-sm-auto me-md-0'>
                    {(addNewLink) ? (
                        <Button variant='outline-dark' className='d-flex' as={Link} to={addNewLink}>
                            {addNew}
                        </Button>
                    ) : ''}
                </span>
            </div>
    )
}

import React, { useState, useEffect } from 'react'
import { Carousel } from 'react-bootstrap'
import { fetchImage } from '../helpers'

import '../scss/GalleryCabana.scss'

const API_URL = process.env.REACT_APP_API_URL

export default function GalleryCabana({ id, galeria }) {
    if (!id)
        id = 'galleryCabana' + Math.random()

    const [index, setIndex] = useState(0);
    const [images, setImages] = useState([]);

    useEffect(() => {
        const getImages = async (galeria) => {
            let tmp = [];

            let imagesArr = galeria.split(',').map(s => s.trim());

            imagesArr.forEach(image => {
                const data = new Promise(resolve => {
                    fetchImage(image)
                        .then(res => {
                            resolve(res);
                        });
                })
                tmp.push(data);
            })

            tmp = await Promise.all(tmp)
            if (tmp.length > 0)
                setImages(tmp);
        }
        getImages(galeria);
    }, [galeria])

    return (

        <div className='GalleryCabana'>
            <Carousel activeIndex={index} indicators={false} controls={(images.length > 1)} onSelect={(i, e) => setIndex(i)}>
                {images.map((image, i) => {

                    
                    return (
                        <Carousel.Item key={'image' + i}>
                            <img
                                className="d-block w-100"
                                src={image.url}
                                alt={image.caption}
                            />
                        </Carousel.Item>
                    );
                })}
            </Carousel>
            <div className="selectors d-flex justify-content-between">
                {(images.length > 1) && images.map((image, i) => {
                    if (i === 3) {
                        return (
                            <div className='selector view-more' key={'selMore'}>
                                <span className='bi bi-three-dots'></span>
                            </div>
                        )
                    }
                    else if (i > 3)
                        return '';
                        
                    return (
                        <div className='selector' key={'sel' + i} onClick={() => setIndex(i)}>
                            <img
                                className="d-block w-100"
                                src={image.url}
                                alt={image.caption}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

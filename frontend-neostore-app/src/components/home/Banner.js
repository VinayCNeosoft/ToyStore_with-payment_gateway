import React from 'react'
import { Carousel } from 'react-bootstrap'

function Banner() {
    return (
        <>
        {/* <div className='container-fluid'> */}
            <Carousel>
            <Carousel.Item>
                <img height={350}
                className="d-block w-100"
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn3.bigcommerce.com%2Fs-zhuza%2Fproduct_images%2Fuploaded_images%2Fsofa-collections-banner-furniture.jpg&f=1&nofb=1"
                alt="First slide"
                />
               {/*  <Carousel.Caption>
                <h3>First slide label</h3>
                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption> */}
            </Carousel.Item>
            <Carousel.Item>
                <img height={350}
                className="d-block w-100"
                src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fimages6.fanpop.com%2Fimage%2Fphotos%2F39500000%2Fbanner-1458896701dinings-copy-1458896701-choice-furniture-superstore-39573782-1365-416.jpg&f=1&nofb=1"
                alt="Second slide"
                />

               {/*  <Carousel.Caption>
                <h3>Second slide label</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption> */}
            </Carousel.Item>
            <Carousel.Item>
                <img height={350}
                className="d-block w-100"
                src="https://dutchhomede.com/wp-content/uploads/2018/01/Living-Room-Banner.jpg"
                //src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.12leaves.com%2Fimages%2Fportfolio%2Fbann%2Ffurniture.jpg&f=1&nofb=1"
                alt="Third slide"
                />

                {/* <Carousel.Caption>
                <h3>Third slide label</h3>
                <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                </Carousel.Caption> */}
            </Carousel.Item>
            </Carousel>
        {/* </div> */}
        </>
    )
}

export default Banner

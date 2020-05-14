import React from 'react'

export default function Announcement() {
    return (
        <div id="announcement"  style={{marginTop: "20px"}} >
            <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                <ol className="carousel-indicators">
                    <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                </ol>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <h5>Send Praise reports, Testimonies and Prayer requests to livingwaters@zijela.com, +2348136776626</h5>
                    </div>
                    <div className="carousel-item">
                        <h5>Join us daily for a time of prayer, praise and reflection in God's word. you can as well download the living waters radio app on the android play store</h5>
                    </div>
                </div>
                <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>
        </div>
    )
}

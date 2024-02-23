import React from 'react'
import './SideNav.scss'
import personsList from '../../json/PersonsList.json'

const SideNav = () => {
    return (
        <div className='SideNav'>
            <input type="text" placeholder='search..' />
            {personsList.map((data, index) => (
                <div className="Card" key={index}>
                    <img src={data.img} alt="" />
                    <div className="Content">
                        <p>{data.name}</p>
                        <p>{data.message}</p>
                    </div>
                    <p className='Time'>{data.time}</p>
                </div>
            ))}
        </div>
    )
}

export default SideNav
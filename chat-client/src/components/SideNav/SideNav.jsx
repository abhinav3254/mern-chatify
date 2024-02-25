import React from 'react'
import './SideNav.scss'
import personsList from '../../json/PersonsList.json'
import searchImage from '../../images/search.svg'

const SideNav = () => {
    return (
        <div className='SideNav'>
            <div className="SearchBar">
                <input type="text" placeholder='search..' />
                <img src={searchImage} alt="" />
            </div>
            <div className="ScrollView">
                {personsList.map((data, index) => (
                    <div className="Card" key={index}>
                        <img src={data.img} alt="" />
                        <div className="Content">
                            <p className='Name'>{data.name}</p>
                            <p className='Message'>{data.message}</p>
                        </div>
                        <p className='Time'>{data.time}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SideNav
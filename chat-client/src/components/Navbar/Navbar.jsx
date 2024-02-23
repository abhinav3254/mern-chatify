import React from 'react'
import './Navbar.scss'
import logo from '../../logo.svg'
import bellLogo from '../../images/bell.svg'
import girlIcon from '../../images/girl.png'

const Navbar = () => {
    return (
        <div className='Navbar'>
            <img src={logo} alt="" />
            <div className="Content">
                <p>NEED HELP?</p>
                <img className='BellIcon' src={bellLogo} alt="" />
                <img className='ProfileIcon' src={girlIcon} alt="" />
            </div>
        </div>
    )
}

export default Navbar
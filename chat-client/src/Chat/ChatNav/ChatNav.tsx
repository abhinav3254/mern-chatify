import React from 'react'
import './ChatNav.scss'
import menuImage from '../../images/svg/menu.svg';

function ChatNav() {
    return (
        <div className='chatNav'>
            <img className='dp' src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" />
            <h2>Ansh Jha</h2>
            <img className='menu' src={menuImage} alt="" />
        </div>
    )
}

export default ChatNav
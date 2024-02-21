import React from 'react'
import './Chat.scss'
import menuImage from '../images/svg/menu.svg';
import sendImage from '../images/svg/send.svg'


function Chat() {
    return (
        <div className='chat'>

            {/* chat nav bar */}
            <div className='chatNav'>
                <img className='dp' src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" />
                <h2>Ansh Jha</h2>
                <img className='menu' src={menuImage} alt="" />
            </div>

            <div className='chat-body-area'>
                <div className="chat-to"></div>
                <div className="chat-from"></div>
            </div>

            <div className="typing-area">
                <input type="text" placeholder='Message' />
                <img src={sendImage} alt="" />
            </div>

        </div>
    )
}

export default Chat
import React from 'react'
import './Chat.scss'
import menuImage from '../images/svg/menu.svg';
import sendImage from '../images/svg/send.svg';
import personChatting from '../json/person-chatting.json'


function Chat() {
    return (
        <div className='chat'>

            {/* chat nav bar */}
            <div className='chatNav'>
                <img className='dp' src={personChatting.userImage} alt="" />
                <h2>{personChatting.personName}</h2>
                <img className='menu' src={menuImage} alt="" />
            </div>

            <div className='chat-body-area'>
                {personChatting.conversation.map((data, index) => (
                    <div key={index} className={data.name === 'user1' ? "chat-from" : "chat-to"}>
                        <p>{data.message}</p>
                        <p className="time">{data.time}</p>
                    </div>
                ))}
            </div>


            <div className="typing-area">
                <input type="text" placeholder='Message' />
                <img src={sendImage} alt="" />
            </div>

        </div>
    )
}

export default Chat
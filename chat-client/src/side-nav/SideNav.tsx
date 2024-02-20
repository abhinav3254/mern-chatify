import React from 'react';
import './SideNav.scss';
import editIcons from '../images/svg/edit.svg';
import searcIcon from '../images/svg/search.svg'
import chatDemo from '../json/chat-json-side.json';
import settingIcon from '../images/svg/setting.svg'

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

function trimMessage(chatMessage: string): string {
    let message = chatMessage;
    if (message.length > 25) {
        message = message.substring(0, 25) + '...';
    }
    return message;
}


function SideNav() {
    return (
        <div className='parent'>
            <div className='profile-details'>
                <img className='profile-pic-user' src="https://funylife.in/wp-content/uploads/2023/10/25_Girls-DP-WWW.FUNYLIFE.IN_.jpg" alt="" />
                <div>
                    <p className='profile-name'>KUSHI JHA</p>
                    <p className='status-message'>SOME STATUS MESSAGE</p>
                </div>
                <img className='edit-icon' src={editIcons} alt="" />
            </div>

            {/* search bar code */}

            <div className="search">
                <input type="text" placeholder='search...' />
                <img src={searcIcon} alt="" />
            </div>

            <div className="chat-component">
                {/* chats are imported here */}
                {chatDemo.map((chat) => (
                    <div className="chat-items">
                        <img src={chat.image} alt="" />
                        <div className='chat-items-element'>
                            <p className='chat-items-name'>{chat.name}</p>
                            <p className='chat-items-msg'>{trimMessage(chat.message)}</p>
                            <p className='chat-items-date'>{formatDate(chat.time)}</p>
                        </div>
                    </div>
                ))}
            </div>


            <div className="extra-components">
                <img src={settingIcon} alt="" />
                <p>Settings</p>
            </div>


        </div>
    )
}

export default SideNav
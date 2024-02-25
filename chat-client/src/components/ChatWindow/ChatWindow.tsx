import React from 'react'
import './ChatWindow.scss'
import ChatNav from '../ChatNav/ChatNav'

const ChatWindow = () => {
    return (
        <div className='ChatWindow'>
            <ChatNav />
            <div className="ScrollView">
                <div className="SecondPerson">
                    <img src="https://images.unsplash.com/photo-1441123694162-e54a981ceba5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cnVzc2luYSUyMGdpcmx8ZW58MHx8MHx8fDA%3D" alt="" />
                    <div className="Column">
                        <p className='Message'>
                            https://plus.unsplash.com/premium_photo-1677231559666-53bed9be43ba?w=800&
                        </p>
                        <p className='Time'>
                            12:08 a.m.
                        </p>
                    </div>
                </div>

                {/* <div className="firstPerson">
                    <img src="https://plus.unsplash.com/premium_photo-1677231559666-53bed9be43ba?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Ym95c3xlbnwwfHwwfHx8MA%3D%3D" alt="" />
                </div> */}
            </div>
        </div>
    )
}

export default ChatWindow
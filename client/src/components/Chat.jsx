import React, { useContext, useEffect, useRef, useState } from 'react'
import Avtar from './Avtar';
import Logo from './Logo';
import { UserContext } from './UserContext';
import axios from 'axios';

function Chat() {

    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const { username, id } = useContext(UserContext);
    const [newMessageText, setNewMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    // creating ref for auto scroll feature
    const divUnderMessages = useRef();

    useEffect(() => {
        connectToWs();
    }, []);

    /**
     * What is the need of this function
     * 
     * actually what is happening right now, is that
     * jakhan haam index.js me kicho change kraye chiye aur save karye chiye takhan ki hoye chaye je ki haam frontend ke refresh krliye 
     * takahn automatically connection gayab ho jaye chaye
     * 
     * ta ham ki karaybe je chaiy je se hum ek function bananbe je ki
     * automatically reconnect krte....
     * 
     */
    function connectToWs() {
        const ws = new WebSocket('ws://localhost:4000');
        setWs(ws);
        ws.addEventListener('message', handleMessage);
        // ws.addEventListener('close', () => console.log('closed'));
        // here when the connection or backend is restarted then this
        // line of code will automatically start reconnecting to the web socket
        // not reconnect immediately instead wait for 1 seconds then try 
        // then try to reconnect again...
        ws.addEventListener('close', () => {
            setTimeout(() => {
                console.log('Disconnected!, trying to reconnect');
                connectToWs();
            }, 1000);
        });
    }

    function showOnlinePeople(peopleArray) {
        const people = {};
        peopleArray.forEach(({ userId, username }) => {
            people[userId] = username;
        });
        setOnlinePeople(people);
    }

    function handleMessage(e) {
        const messageData = JSON.parse(e.data);
        if ('ononline' in messageData) {
            showOnlinePeople(messageData.ononline);
        } else if ('text' in messageData) {
            setMessages(prev => ([...prev, { ...messageData }]));
        }
    }

    function sendMessage(e) {
        e.preventDefault();
        ws.send(JSON.stringify({
            recipient: selectedUserId,
            text: newMessageText
        }));
        setNewMessageText('');
        setMessages(prev => ([...prev, {
            text: newMessageText,
            sender: id,
            recipient: selectedUserId,
            id: Date.now(),
        }]));
    }

    /**
     * here we have used the scroll feature and in the sendMessage because it's a async function and it value is not getting update instantly so to resolve this issue we have used here.
     */
    useEffect(() => {
        const div = divUnderMessages.current;
        if (div) {
            div.scrollIntoView({ behaviour: 'smooth', block: 'end' });
        }
    }, [messages]);


    /**
     * This useEffect will run when selected user changes
     */
    useEffect(() => {
        if (selectedUserId) {
            // this route will fecth chat between our user and selected user
            axios.get('/messages/' + selectedUserId);
        }
    }, [selectedUserId]);

    // deleting our user from the JSON Object
    const onlinePeopleExcludingOurUser = { ...onlinePeople };
    delete onlinePeopleExcludingOurUser[id];

    // I am using Lodash library instead I am using my own function
    // to get unique by id
    const getUniqueById = (array, key) => {
        const uniqueMap = new Map();
        array.forEach(item => {
            uniqueMap.set(item[key], item);
        });
        return Array.from(uniqueMap.values());
    };

    const messagesWithoutDupes = getUniqueById(messages, 'id');

    return (
        <div className='flex h-screen'>
            <div className="bg-white-100 w-1/3">
                <Logo />
                {Object.keys(onlinePeopleExcludingOurUser).map(userId => (
                    <div
                        className={"border-b border-gray-100 flex gap-2 items-center cursor-pointer " + (userId === selectedUserId ? 'bg-blue-50' : '')}
                        key={userId}
                        onClick={() => setSelectedUserId(userId)}>
                        {userId === selectedUserId && (
                            <div className="w-1 bg-blue-500 h-12 rounded-tr-md"></div>
                        )}
                        <div className=" flex gap-2 py-2 px-4 items-center">
                            <Avtar username={onlinePeople[userId]} userId={userId} />
                            <span className="text-gray-800">{onlinePeople[userId]}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col bg-blue-50 w-2/3 p-2">
                <div className="flex-grow">
                    {!selectedUserId && (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-gray-300">&larr; selected a person to chat</div>
                        </div>
                    )}
                    {!!selectedUserId && (
                        <div className="relative h-full">
                            <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                                {messagesWithoutDupes.map((message, key) => (
                                    <div className={(message.sender === id ? 'text-right' : 'text-left')}>
                                        <div key={key} className={"text-left inline-block p-2 my-2 rounded-md text-sm " + (message.sender === id ? "bg-blue-500 text-white" : "bg-white text-gray-500")}>
                                            sender:{message.sender} <br />
                                            my id:{id} <br />
                                            {message.text}
                                        </div>
                                    </div>
                                ))}
                                {/* this div is for scroll automatically thing */}
                                <div ref={divUnderMessages}></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* double !! means it will convert the value into boolean */}
                {!!selectedUserId && (
                    <form className="flex gap-2" onSubmit={sendMessage}>
                        <input type="text" placeholder='Message'
                            value={newMessageText}
                            onChange={(e) => setNewMessageText(e.target.value)}
                            className="bg-white border p-2 flex-grow rounded-sm"
                        />
                        <button type='submit' className="bg-blue-500 p-2 text-white rounded-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Chat
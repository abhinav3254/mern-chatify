import React, { useEffect, useState } from 'react'

function Chat() {

    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4000');
        setWs(ws);
        ws.addEventListener('message', handleMessage)
    }, []);

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
        }
    }

    return (
        <div className='flex h-screen'>
            <div className="bg-white-100 w-1/3">
                {Object.keys(onlinePeople).map(userId => (
                    <div>{onlinePeople[userId]}</div>
                ))}
            </div>
            <div className="flex flex-col bg-blue-50 w-2/3 p-2">
                <div className="flex-grow">messages</div>
                <div className="flex gap-2">
                    <input type="text" placeholder='Message' className="bg-white border p-2 flex-grow rounded-sm" />
                    <button className="bg-blue-500 p-2 text-white rounded-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Chat
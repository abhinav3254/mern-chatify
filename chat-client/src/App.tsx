import React from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import SideNav from './components/SideNav/SideNav';
import ChatWindow from './components/ChatWindow/ChatWindow';

function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="component">
        <SideNav />
        <ChatWindow />
      </div>
    </div>
  );
}

export default App;

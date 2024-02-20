import React from 'react';
import logo from './logo.svg';
import './App.css';
import SideNav from './side-nav/SideNav';
import Chat from './Chat/Chat';

function App() {
  return (
    <div className="app">
      <SideNav />
      <Chat />
    </div>
  );
}

export default App;

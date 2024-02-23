import React from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import SideNav from './components/SideNav/SideNav';

function App() {
  return (
    <div className="app">
      <Navbar />
      <SideNav />
    </div>
  );
}

export default App;

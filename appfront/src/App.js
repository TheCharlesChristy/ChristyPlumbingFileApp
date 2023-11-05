import './App.css';
import { useState } from 'react';
import Login from './App/Login/Login.js';

function App() {

  const gotoadmin = (username, password) => {
    dologintransform();
    setTimeout(() => {
      setContent("Some Admin Page")
    }, 1200);
  }
  const gotouser = (username, password) => {
    dologintransform();
    setTimeout(() => {
      setContent("Some User Page")
    }, 1200);
  }
  function dologintransform(){
    document.getElementById('Login').style.transform = 'translateX(-100%)';
  }

  const [content, setContent] = useState(<Login gotoadmin={gotoadmin} gotouser={gotouser}/>);

  return (
    <div className="App">
      <div className='App-Logo'>
        <p className='App-Logo-Text-Christy'>CHRISTY</p>
        <p className='App-Logo-Text-PAH'>Plumbing & Heating</p>
      </div>
      {content}
    </div>
  );
}

export default App;

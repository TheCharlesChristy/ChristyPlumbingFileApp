import './App.css';
import { useState } from 'react';
import Login from './App/Login/Login.js';
import Admin from './App/Main/Admin/Admin.js';

function App() {

  function doouttransform(){
    let appcontent = document.getElementById('App-Content');
    appcontent.classList.add('App-Content-Out');
  }

  const gotoadmin = (username, password) => {
    doouttransform();
    setTimeout(() => {
      setContent(<Admin uname={username} pass={password} logout={gotologin}/>)
      let appcontent = document.getElementById('App-Content');
      appcontent.classList.remove('App-Content-Out');
    }, 1000);
  }
  const gotouser = (username, password) => {
    doouttransform();
    setTimeout(() => {
      setContent(<Admin uname={username} pass={password} logout={gotologin}/>)
      let appcontent = document.getElementById('App-Content');
      appcontent.classList.remove('App-Content-Out');
    }, 1000);
  }
  const gotologin = () => {
    doouttransform();
    setTimeout(() => {
      setContent(<Login gotoadmin={gotoadmin} gotouser={gotouser}/>)
      let appcontent = document.getElementById('App-Content');
      appcontent.classList.remove('App-Content-Out');
    }, 1000);
  }

  const [content, setContent] = useState(<Login gotoadmin={gotoadmin} gotouser={gotouser}/>);

  return (
    <div className="App">
      <div className='App-Logo'>
        <p className='App-Logo-Text-Christy'>CHRISTY</p>
        <p className='App-Logo-Text-PAH'>Plumbing & Heating</p>
      </div>
      <div id='App-Content' className='App-Content'>
        {content}
      </div>
    </div>
  );
}

export default App;

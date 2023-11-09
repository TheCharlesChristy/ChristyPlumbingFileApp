import React from 'react'
import { useState, useEffect } from 'react'
import './Admin.css'
import AdminControls from './AdminContent/AdminControls.js'
import FileExplorer from './FileSystem/FileExplorer.js'

function Admin({ uname, pass, logout }) {
  const [username, setUsername] = useState(uname);
  const [password, setPassword] = useState(pass);
  const [addFolder, setaddFolder] = useState(false);
  const [addFile, setaddFile] = useState(false);

  const triggeraddFolder = (val) => {
    setaddFolder(val);
  };
  const triggeraddFile = (val) => {
    setaddFile(val);
  };

  return (
    <div className='Admin'>
      <AdminControls logout={logout} triggeraddFile={triggeraddFile} triggeraddFolder={triggeraddFolder}/>
      <div className='Admin-Container-FileExplorer'>
        <p className='Admin-Tag'>File Explorer</p>
        <FileExplorer addFolder={addFolder} addFile={addFile} triggeraddFile={triggeraddFile} triggeraddFolder={triggeraddFolder}/>
      </div>
      <div className='Admin-Filler'></div>
    </div>
  )
}

export default Admin

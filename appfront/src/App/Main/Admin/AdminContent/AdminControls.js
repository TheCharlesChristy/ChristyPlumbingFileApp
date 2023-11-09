import React from 'react'
import { useState, useEffect } from 'react'
import './AdminControls.css'

function AdminControls({ logout, triggeraddFolder, triggeraddFile }) {
  function doaddFolder() {
    triggeraddFolder(true);
  }
  function doaddFile() {
    triggeraddFile(true);
  }
  return (
    <div className='AdminControls'>
      <div className='AdminControls-Logout'>
        <button className='AdminControls-Logout-Btn' title='Logout' onClick={logout}></button>
      </div>
      <p className='AdminControls-Tag'>Logout</p>
      <div className='AdminControls-AddFolder'>
        <button className='AdminControls-AddFolder-Btn' title='Add Folder' onClick={doaddFolder}></button>
      </div>
      <p className='AdminControls-Tag'>Add Folder</p>
      <div className='AdminControls-AddFile'>
        <button className='AdminControls-AddFile-Btn' title='Add File' onClick={doaddFile}></button>
      </div>
      <p className='AdminControls-Tag'>Add File</p>
      <div className='AdminControls-ManageUsers'>
        <button className='AdminControls-ManageUsers-Btn' title='Manage Users'></button>
      </div>
      <p className='AdminControls-Tag'>Manage Users</p>
    </div>
  )
}

export default AdminControls

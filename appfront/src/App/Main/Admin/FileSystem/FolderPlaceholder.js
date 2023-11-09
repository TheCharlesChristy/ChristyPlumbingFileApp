import React, { useState, useEffect } from 'react'

function FolderPlaceholder({ deletePlaceholder, SubmitFolder }) {
    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            deletePlaceholder()
        }else if(event.key === 'Enter'){
            SubmitFolder()
        }
    }
    return (
        <div className='Folder' id='FolderPlaceholder'>
                <div className='Placeholder-Header'>
                        <div className='Folder-Header-Icon'></div>
                        <input type='text' className='Placeholder-Input' placeholder='Folder Name...' onKeyDown={handleKeyDown}></input>
                </div>
        </div>
    )
}

export default FolderPlaceholder

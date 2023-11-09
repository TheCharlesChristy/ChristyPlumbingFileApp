import React from 'react'
import { useState, useEffect } from 'react'
import './File.css'

function File({ fname, FileData, onselect }) {
  const [filename, setFilename] = useState(fname);
  const [fileid, setFileid] = useState(FileData.id);

  const openfile = (e) => {
    console.log("Hi")
  }

  const ondouble = (e) => {
    openfile(e);
    onselect(e);
  };

  const managefile = (e) => {
    console.log("Hi")
  }

  return (
    <div className='File'>
        <div className='File-Header' onClick={onselect} onDoubleClick={ondouble}>
            <div className='LHS'>
                <div className='File-Header-Icon'></div>
                <p className='File-Header-Name'>{filename}</p>
            </div>
            <button className='File-Header-Manage' onClick={managefile}></button>
        </div>
    </div>
  )
}

export default File

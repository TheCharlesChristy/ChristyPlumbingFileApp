import React, { useEffect, useState } from 'react';
import './Folder.css';

function Folder({ name, FolderData, contents, onselect, appendToOpenFolders, popFromOpenFolders, isopen }) {
    const [folderid, setFolderid] = useState(FolderData.id);
    const [foldername, setFoldername] = useState(name);
    const [foldercontents, setFoldercontents] = useState(contents);
    const [showContents, setShowContents] = useState(isopen);
    const [rotation, setRotation] = useState(0);
    

    const toggleContents = (e) => {
        let target = e.target;
        if(target.classList.contains('Folder-Header-DropDown')===false) {
            target.childNodes.forEach((element) => {
                if(element.classList.contains('Folder-Header-DropDown')){
                    target = element;
                }
            });
        }
        if(!showContents) {
            setRotation(90);
            appendToOpenFolders(foldername);
        }else{
            setRotation(0);
            popFromOpenFolders(foldername);
        }
        setShowContents(!showContents);
    };

    useEffect(() => {
        if(showContents){
            setRotation(90);
        }else{
            setRotation(0);
        }
    }, [showContents])

    useEffect(() => {
        setFoldercontents(contents);
    }, [contents])

    const ondouble = (e) => {
        toggleContents(e);
        onselect(e);
    };

    return (
        <div className='Folder' id={FolderData.url+"/"+FolderData.name}>
            <div className='Folder-Header'  onClick={ondouble} onDoubleClick={ondouble}>
                <p className='HiddenCompleteUrl'>{FolderData.url+"/"+FolderData.name}</p>
                <div className='LHS'>
                    <div className='Folder-Header-Icon'></div>
                    <p className='Folder-Header-Name'>{foldername}</p>
                </div>
                <button className='Folder-Header-DropDown' style={{rotate: rotation+"deg"}} onClick={toggleContents}></button>
            </div>
            <div className='Folder-Contents' id={folderid}>
            {showContents && (
                    <div>
                    {foldercontents.map((content, index) => (
                        <div key={index} className='Folder-Filler'>{content}</div>
                    ))}
                    </div>
            )}
            </div>
        </div>
    );
}

export default Folder;

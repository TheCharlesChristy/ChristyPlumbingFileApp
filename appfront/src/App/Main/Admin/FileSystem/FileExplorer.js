import React from 'react'
import { useState, useEffect } from 'react'
import './FileExplorer.css'
import Folder from './Folder.js'
import File from './File.js'
import FolderPlaceholder from './FolderPlaceholder.js'

function FileExplorer({ addFolder, addFile, triggeraddFile, triggeraddFolder }) {
  const [selecteditem, setSelecteditem] = useState();
  const [files, setFiles] = useState([]);
  const [filesComponents, setFilesComponents] = useState([]);
  const [openFolders, setOpenFolders] = useState([]);
  const [Original, setOriginal] = useState([]);

  //These functions are used to keep track of which folders are open
  const appendToOpenFolders = (folderName) => {
    setOpenFolders([...openFolders, folderName]);
  }
  const popFromOpenFolders = (foldername) => {
    let index = openFolders.indexOf(foldername);
    setOpenFolders(openFolders.slice(0, index));
  }
  //End


  //These functions are used to create the folder and file objects
  function createFolderobject(folderdata) {
    console.log(folderdata);
    let isopen = false;
    if(openFolders.includes(folderdata.name)){
      isopen = true;
    }
    let contents = [];
    console.log(folderdata.contents);
    
    return <Folder key={folderdata.id} name={folderdata.name} FolderData={folderdata} contents={contents} onselect={changeSelected} appendToOpenFolders={appendToOpenFolders} popFromOpenFolders={popFromOpenFolders} isopen={isopen} />
  }
  function createPlaceholderobject(folderdata) {
    return <FolderPlaceholder key={folderdata.id} deletePlaceholder={DeletePlaceholder} SubmitFolder={SubmitPlaceholder}/>
  }
  function createFileobject(filedata) {
    return <File key={filedata.id} fname={filedata.name} onselect={changeSelected} FileData={filedata}/>
  }
  //End

  useEffect(() => {
    async function dofunction(files){
      let res = []
      files.forEach((item) => {
        if(item.type==='folder'){
          res.push(createFolderobject(item));
          if(item.contents.length>0){
            dofunction(item.contents);
          }
        }else if(item.type==='folderplaceholder'){
          res.push(createPlaceholderobject(item));
        }else if(item.type==='file'){
          res.push(createFileobject(item));
        }
      });
      return res;
    }
    dofunction(files).then((result) => {
      setFilesComponents(result);
    });
  }, [files])


  //These functions are used to add and delete folders and files
  function DeletePlaceholder() {
    setSelecteditem([])
    refresh();
  }

  function SubmitPlaceholder() {
    console.log("Submitted placeholder");
  }
  //End

  //These functions are used to get the data from the server
  function getdata() {
    setFiles([]);
    setOriginal([]);
    triggeraddFolder(false);
    fetch('http://192.168.0.43:5000/api/get_files')
      .then(response => response.json())
      .then(data => {
        if(Original.length===0){
          setOriginal(data.files);
        }
        setFiles(data.files);
      })
      .catch(error => console.error(error));
  }
  
  useEffect(() => {
    getdata();
  }, [])
  //End


  function TraverseAndAdd(tree, nextbranches, datatoadd) {
    if(nextbranches.length===0){
      tree = [datatoadd, ...tree]
      return tree;
    }else{
      let found = false;
      let index = 0;
      while(!found){
        let item = tree[index];
        if(item.name===nextbranches[0]){
          found = true;
          let res = TraverseAndAdd(item.contents, nextbranches.slice(1), datatoadd);
          if(res===false){
            return res;
          }else{
            tree[index].contents = res;
          }
        }else{
          index++;
        }
      }
    }
    return tree
  }

  useEffect(() => {
    const handleAddFolder = async () => {
      if (addFolder === true) {
        if (selecteditem) {
          let folderplaceholder = {
            type: 'folderplaceholder',
            id: -1,
            owner: 'admin',
            url: selecteditem.join('/')
          };
          setFiles(TraverseAndAdd(files, selecteditem, folderplaceholder));
        }
      }
    };
  
    handleAddFolder(); // Call the inner function
  
  }, [addFolder]);
  

  useEffect(() => {
    if(addFile){
    }
  }, [addFile]);

  function refresh() {
    getdata();
  }

  const changeSelected = (e) => {
    document.querySelectorAll('.Explorer-Selected').forEach((element) => {
      element.classList.remove('Explorer-Selected');
    });
    let finaltarget = e.target;
    if(finaltarget!==selecteditem){
      while(!finaltarget.classList.contains('Folder-Header') && !finaltarget.classList.contains('File-Header')) {
        finaltarget = finaltarget.parentElement;
      }
      finaltarget.classList.add('Explorer-Selected');
      if(finaltarget.classList.contains('Folder-Header')){
        let hiddencompleteurl = finaltarget.querySelector('.HiddenCompleteUrl').innerHTML;
        let urls = hiddencompleteurl.split('/').slice(1);
        setSelecteditem(urls);
      }
    }else{
      setSelecteditem(null);
    }
  }

  return (
    <div className='FileExplorer'>
      <button className='FileExplorer-Refresh' onClick={refresh}>Refresh</button>
      {filesComponents.map((file) => {
        return file
      })}
    </div>
  )
}

export default FileExplorer

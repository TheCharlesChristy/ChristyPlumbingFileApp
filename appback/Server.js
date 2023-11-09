const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./Databasehandler.js');
const crypto = require('crypto');

const Database = new db('./Database.json');

function hashPassword(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}
function orderFilesAndFolders(data) {
    const folders = data.filter(item => item.type === 'folder');
    const files = data.filter(item => item.type === 'file');

    folders.forEach(folder => {
        folder.contents = orderFilesAndFolders(folder.contents);
    });

    const orderedFolders = folders.sort((a, b) => a.name.localeCompare(b.name));
    const orderedFiles = files.sort((a, b) => a.name.localeCompare(b.name));

    return orderedFolders.concat(orderedFiles);
}
function urltolist(dirurl){
    const dirList = dirurl.split(/\\|\//);
    return dirList;
}
function AuthenticateUser(username, password){
    let user = Database.getUser(username);
    if(user.password === hashPassword(password)){
        return true;
    }else{
        return false;
    }
}
function AddUser(username, password) {
    let userjson = {
        id: username, password: hashPassword(password)
    };
    try{
        Database.addUser(userjson);
        console.log('User '+username+' added');
        return true;
    }catch(err){
        console.log(err);
    }
}
function UpdateUserPass(username, oldpassword, newpassword){
    if(AuthenticateUser(username, oldpassword)){
        try{
            Database.UpdateUserPass(username, hashPassword(newpassword));
            console.log('User '+username+' password changed');
            return true;
        }catch(err){
            console.log(err);
        }
    }else{
        console.log(new Error('Incorrect password'));
        return false;
    }
}
function UpdateUserUsername(oldusername, newusername, password){
    if(AuthenticateUser(oldusername, password)){
        try{
            Database.UpdateUserUsername(oldusername, newusername);
            console.log('User '+username+' username changed');
            return true;
        }catch(err){
            console.log(err);
        }
    }else{
        console.log(new Error('Incorrect password'));
        return false;
    }
}
function DeleteUser(username, password){
    if(AuthenticateUser(username, password)){
        try{
            Database.DeleteUser(username);
            console.log('User '+username+' deleted');
            return true;
        }catch(err){
            console.log(err);
        }
    }else{
        console.log(new Error('Incorrect password'));
        return false;
    }
}
function CreateFile(username, password, dirurl, filename, filedata){
    if(AuthenticateUser(username, password)){
        try{
            let dirList = urltolist(dirurl);
            let filejson = {
                type: 'file',
                name: filename,
                id: Database.GetCurrentId()+1,
                extension: filename.split('.').pop(),
                owner: username,
                url: dirurl
            };
            Database.CreateFile(dirList, filejson, filedata);
            console.log('File '+filename+' created');
            return true;
        }catch(err){
            console.log(err);
        }
    }else{
        console.log(new Error('Incorrect password'));
        return false;
    }
}
function ChangeFileData(username, password, filename, fileid, filedata){
    if(AuthenticateUser(username, password)){
        try{
            Database.ChangeFileData(fileid, filename.split('.').pop(), filedata);
            console.log('File '+fileid+' data changed');
            return true;
        }catch(err){
            console.log(err);
        }
    }else{
        console.log(new Error('Incorrect password'));
        return false;
    }
}
function DeleteFile(username, password, fileid, filedir, fileextension){
    if(AuthenticateUser(username, password)){
        try{
            Database.DeleteFile(fileid, urltolist(filedir), fileextension);
            console.log('File '+fileid+' deleted');
            return true;
        }catch(err){
            console.log(err);
        }
    }else{
        console.log(new Error('Incorrect password'));
        return false;
    }
}
function GetFile(username, password, fileid, fileextension){
    if(AuthenticateUser(username, password)){
        try{
            let file = Database.GetFile(fileid, fileextension);
            console.log('File '+fileid+' retrieved');
            return file;
        }catch(err){
            console.log(err);
        }
    }else{
        console.log(new Error('Incorrect password'));
        return false;
    }
}
function ChangeDriveItemName(username, password, fileid, filedir, newfilename){
    if(AuthenticateUser(username, password)){
        try{
            Database.ChangeFileName(fileid, urltolist(filedir), newfilename);
            console.log('File '+fileid+' name changed');
            return true;
        }catch(err){
            console.log(err);
        }
    }else{
        console.log(new Error('Incorrect password'));
        return false;
    }
}
function CreateFolder(username, password, dirurl, foldername){
    if(AuthenticateUser(username, password)){
        try{
            let dirList = urltolist(dirurl);
            let folderjson = {
                type: 'folder',
                name: foldername,
                id: Database.GetCurrentId()+1,
                owner: username,
                url: dirurl,
                contents: []
            };
            Database.CreateFolder(dirList, folderjson);
            console.log('Folder '+foldername+' created');
            return true;
        }catch(err){
            console.log(err);
        }
    }else{
        console.log(new Error('Incorrect password'));
        return false;
    }
}
function DeleteFolder(username, password, folderid, folderdir){
    if(AuthenticateUser(username, password)){
        try{
            Database.DeleteFolder(folderid, urltolist(folderdir));
            console.log('Folder '+folderid+' deleted');
            return true;
        }catch(err){
            console.log(err);
        }
    }else{
        console.log(new Error('Incorrect password'));
        return false;
    }
}
function AddAdmin(username, password, adminusername){
    if(AuthenticateUser(username, password)){
        try{
            Database.AddAdmin(adminusername);
            console.log('Admin '+adminusername+' added');
            return true;
        }catch(err){
            console.log(err);
        }
    }
}
function RemoveAdmin(username, password, adminusername){
    if(username==="admin"&&AuthenticateUser(username, password)){
        try{
            Database.RemoveAdmin(adminusername);
            console.log('Admin '+adminusername+' removed');
            return true;
        }catch(err){
            console.log(err);
        }
    }
}

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

app.post('/api/login', (req, res) => {
    let username = req.body.username.toLowerCase();
    let password = req.body.password;
    try {
        if (AuthenticateUser(username, password)) {
            let isadmin = Database.GetAdmins().includes(username);
            res.status(200).send({ success: true, admin: isadmin, username: username, password: password });
        } else {
            res.status(401).send({ success: false, error: 'Incorrect password'});
        }
    } catch (err) {
        console.log(err)
        res.status(400).send({ success: false, error: 'User not found'});
    }
});

app.get('/api/get_files', (req, res) => {
    let files = Database.GetFiles();
    files = orderFilesAndFolders(files);
    res.status(200).send({ success: true, files: files });
});
app.post('/api/create_folder', (req, res) => {
    let dirurl = "Drive/"+req.body.dirurl;
    console.log(dirurl);
    try{
        CreateFolder('admin', 'admin', dirurl, 'New Folder');
        let files = Database.GetFiles();
        files = orderFilesAndFolders(files);
        res.status(200).send({ success: true, files: files });
    }catch(err){
        console.log(err);
        res.status(400).send({ success: false, error: err });
    }
});

// ... rest of the server code
app.listen(5000, () => {
    console.log('Server started on port 5000');
});


const fs = require('fs');

class db {
  constructor(filePath) {
    this.filePath = filePath;
  }
  getdb() {
    const data = fs.readFileSync(this.filePath, 'utf8');
    return JSON.parse(data);
  }
  getbranch(branchname, root = this.getdb()) {
    return root[branchname];
  }
  isduplicateuser(username, users=this.getUsers()) {
    for (let entry of users) {
        if (entry.id === username) {
            return true;
        }
    }  
    return false;
  }
  getUsers() {
    return this.getbranch('users');
  }
  getUser(username) {
    let users = this.getUsers();
    for (let entry of users) {
        if (entry.id === username) {
            return entry;
        }
    }  
    return false;
  }
  addUser(userjson) {
    let db = this.getdb();
    if(this.isduplicateuser(userjson.id)){
        throw new Error('User already exists');
    }else{
        db.users.push(userjson);
        fs.writeFileSync(this.filePath, JSON.stringify(db, null, 2));
    }
  }
  UpdateUserPass(username, newpassword) {
    let db = this.getdb();
    let users = this.getUsers();
    for(let i=0; i<users.length; i++){
        if(users[i].id === username){
            users[i].password = newpassword;
            db.users = users;
            fs.writeFileSync(this.filePath, JSON.stringify(db, null, 2));
            return true;
        }
    }
  }
  UpdateUserUsername(oldusername, newusername) {
    let db = this.getdb();
    let users = this.getUsers();
    for(let i=0; i<users.length; i++){
        if(users[i].id === oldusername){
            users[i].id = newusername;
            db.users = users;
            fs.writeFileSync(this.filePath, JSON.stringify(db, null, 2));
            return true;
        }
    }
  }
  DeleteUser(username) {
    let db = this.getdb();
    let users = this.getUsers();
    for(let i=0; i<users.length; i++){
        if(users[i].id === username){
            users.splice(i, 1);
            db.users = users;
            fs.writeFileSync(this.filePath, JSON.stringify(db, null, 2));
            return true;
        }
    }
  }
  GetCurrentId(){
    return this.getdb().currentid
  }
  IncrementCurrentId(){
    let db = this.getdb();
    db.currentid++;
    fs.writeFileSync(this.filePath, JSON.stringify(db, null, 2));
  }
  TraverseAndAdd(tree, nextbranches, datatoadd) {
    console.log("\n\n\n")
    console.log("tree")
    console.log(tree)
    console.log("nextbranches")
    console.log(nextbranches)
    if(nextbranches.length===0){
      for(let i=0; i<tree.length; i++){
        if(tree[i].name===datatoadd.name){
          return false;
        }
      }
      tree.push(datatoadd);
      return tree;
    }else{
      let found = false;
      let index = 0;
      while(!found){
        console.log("tree[index]")
        console.log(tree[index])
        let item = tree[index];
        if(item.name===nextbranches[0]){
          found = true;
          let res = this.TraverseAndAdd(item.contents, nextbranches.slice(1), datatoadd);
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
  TraverseAndDelete(tree, nextbranches, id) {
    if(nextbranches.length===0){
      for(let i=0; i<tree.length; i++){
        if(tree[i].id===id){
          tree.splice(i, 1);
          return tree;
        }
      }
      return false;
    }else{
      let found = false;
      let index = 0;
      while(!found){
        let item = tree[index];
        if(item.name===nextbranches[0]){
          found = true;
          let res = this.TraverseAndDelete(item.contents, nextbranches.slice(1), id);
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
  TraverseAndChange(tree, nextbranches, id, key, value) {
    if(nextbranches.length===0){
      for(let i=0; i<tree.length; i++){
        if(tree[i].id===id){
          tree[i][key] = value;
          if(tree[i].type==='folder'){
            tree[i].contents = this.UpdateSubUrls(tree[i].contents, value);
            return tree;
          }else{
            return tree;
          }
        }
      }
      throw new Error('File does not exist');
    }else{
      let found = false;
      let index = 0;
      while(!found){
        let item = tree[index];
        if(item.name===nextbranches[0]){
          found = true;
          let res = this.TraverseAndChange(item.contents, nextbranches.slice(1), id, key, value);
          if(res===false){
            return res;
          }else{
            tree[index].contents = res;
            console.log(tree)
            return tree;
          }
        }else{
          index++;
        }
      }
    }
  }
  UpdateSubUrls(tree, newurl, depth=1) {
    for(let i=0; i<tree.length; i++){
      let split = tree[i].url.split('/');
      split[split.length-depth] = newurl;
      tree[i].url = split.join('/');
      if(tree[i].type==='folder'){
        tree[i].contents = this.UpdateSubUrls(tree[i].contents, newurl, depth+1);
      }
    }
    return tree;
  }
  CreateFile(fileurl, filejson, filedata) {
    let db = this.getdb();
    let Drive = db.Drive
    Drive=this.TraverseAndAdd(Drive, fileurl.slice(1), filejson);
    if(Drive===false){
      throw new Error('File already exists');
    }else{
      db.Drive = Drive;
      fs.writeFileSync(this.filePath, JSON.stringify(db, null, 2));
      this.IncrementCurrentId();
      //now write file to disk
      fs.writeFileSync('./Database_files/'+filejson.id+'.'+filejson.extension, filedata);
    }
  }
  ChangeFileData(fileid, fileextension, filedata) {
    let filename = fileid+'.'+fileextension;
    fs.writeFileSync('./Database_files/'+filename, filedata);
  }
  DeleteFile(fileid, fileurl, fileextension) {
    let db = this.getdb();
    let Drive = db.Drive;
    Drive = this.TraverseAndDelete(Drive, fileurl.slice(1), fileid);
    if(Drive===false){
      throw new Error('File does not exist');
    }else{
      db.Drive = Drive;
      fs.writeFileSync(this.filePath, JSON.stringify(db, null, 2));
      //now delete file from disk
      fs.unlinkSync('./Database_files/'+fileid+'.'+fileextension);
    }
  }
  GetFile(fileid, fileextension) {
    let filename = fileid+'.'+fileextension;
    const data = fs.readFileSync('./Database_files/'+filename, 'utf8');
    return data;
  }
  ChangeFileName(fileid, fileurl, newfilename) {
    let db = this.getdb();
    let Drive = db.Drive;
    Drive = this.TraverseAndChange(Drive, fileurl.slice(1), fileid, 'name', newfilename);
    if(Drive===false){
      throw new Error('File does not exist');
    }else{
      db.Drive = Drive;
      fs.writeFileSync(this.filePath, JSON.stringify(db, null, 2));
    }
  }
  CreateFolder(folderurl, folderjson) {
    let db = this.getdb();
    let Drive = db.Drive
    Drive=this.TraverseAndAdd(Drive, folderurl.slice(1), folderjson);
    if(Drive===false){
      throw new Error('Folder already exists');
    }else{
      db.Drive = Drive;
      fs.writeFileSync(this.filePath, JSON.stringify(db, null, 2));
      this.IncrementCurrentId();
    }
  }
  DeleteFolder(folderid, folderurl) {
    let db = this.getdb();
    let Drive = db.Drive;
    Drive = this.TraverseAndDelete(Drive, folderurl.slice(1), folderid);
    if(Drive===false){
      throw new Error('Folder does not exist');
    }else{
      db.Drive = Drive;
      fs.writeFileSync(this.filePath, JSON.stringify(db, null, 2));
    }
  }
  GetFiles(){
    return this.getdb().Drive;
  }
  GetAdmins(){
    return this.getdb().admins;
  }
  AddAdmin(adminname){
    let db = this.getdb();
    db.admins.push(adminname);
    fs.writeFileSync(this.filePath, JSON.stringify(db, null, 2));
  }
  RemoveAdmin(adminname){
    let db = this.getdb();
    let admins = db.admins;
    for(let i=0; i<admins.length; i++){
        if(admins[i] === adminname){
            admins.splice(i, 1);
            db.admins = admins;
            fs.writeFileSync(this.filePath, JSON.stringify(db, null, 2));
            return true;
        }
    }
  }
}

module.exports = db;

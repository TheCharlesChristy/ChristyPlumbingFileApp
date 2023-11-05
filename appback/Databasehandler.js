
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

  isduplicate(username, branch) {
    for (const entry of branch) {
        if (entry.username === username) {
            return true;
        }
    }  
    return false;
  }

  createEntry(branches, entry, tree = this.getdb()) {
    let branch = tree;
    for (const branchname of branches) {
        branch = branch[branchname];
    }
    if (!branch) {
      throw new Error("Branch not found");
    }
    if(branches[0] === "users") {
      if(!entry.username || !entry.password) {
        throw new Error("Username or password not provided");
      }
      if(this.isduplicate(entry.username, branch)===true) {
        throw new Error("Username already exists");
      }else{
        branch.push(entry);
        fs.writeFileSync(this.filePath, JSON.stringify(tree, null, 2));
      }
    }else{
        //this will be if its a file directory
        return;
    }
  }
  getEntry(branches, id, tree = this.getdb()) {
    let branch = tree;
    for (const branchname of branches) {
        branch = branch[branchname];
    }
    if (!branch) {
      throw new Error("Branch not found");
    }
    for (const entry of branch) {
      if (entry.id === id) {
        return entry;
      }
    }
    throw new Error("Entry not found");
  }
  updateEntry(branches, newEntry, tree = this.getdb()) {
    let branch = tree;
    for (const branchname of branches) {
        branch = branch[branchname];
    }
    if (!branch) {
      throw new Error("Branch not found");
    }
    for (const entry of branch) {
      if (entry.id === newEntry.id) {
        Object.assign(entry, newEntry);
        fs.writeFileSync(this.filePath, JSON.stringify(tree, null, 2));
        return;
      }
    }
    throw new Error("Entry not found");
  }
  deleteEntry(branches, id, tree = this.getdb()) {
    let branch = tree;
    for (const branchname of branches) {
        branch = branch[branchname];
    }
    if (!branch) {
      throw new Error("Branch not found");
    }
    for (const entry of branch) {
      if (entry.id === id) {
        branch.splice(branch.indexOf(entry), 1);
        fs.writeFileSync(this.filePath, JSON.stringify(tree, null, 2));
        return;
      }
    }
    throw new Error("Entry not found");
  }
  createBranch(branches, branchname, tree = this.getdb()) {
    let branch = tree;
    for (const branchname of branches) {
        branch = branch[branchname];
    }
    if (!branch) {
      throw new Error("Branch not found");
    }
    branch[branchname] = [];
    fs.writeFileSync(this.filePath, JSON.stringify(tree, null, 2));
  }
  deleteBranch(branches, branchname, tree = this.getdb()) {
    let branch = tree;
    for (const branchname of branches) {
      branch = branch[branchname];
    }
    if (!branch) {
      throw new Error("Branch not found");
    }
    delete branch[branchname];
    fs.writeFileSync(this.filePath, JSON.stringify(tree, null, 2));
  }
  getAdmins(tree = this.getdb()) {
    return tree.admins;
  }
  addAdmin(username, tree = this.getdb()) {
    tree.admins.push(username);
    fs.writeFileSync(this.filePath, JSON.stringify(tree, null, 2));
  }
  removeAdmin(username, tree = this.getdb()) {
    tree.admins.splice(tree.admins.indexOf(username), 1);
    fs.writeFileSync(this.filePath, JSON.stringify(tree, null, 2));
  }
}

module.exports = db;

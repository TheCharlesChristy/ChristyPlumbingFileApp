const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./Databasehandler.js');
const crypto = require('crypto');

const Database = new db('./Database.json');
// list of server access database commands
// Database.createEntry(["Dir1", "Dir2"...], entrydata*seemorebelow*)});
// Database.getEntry(["Dir1", "Dir2"...], id (username or id));
// Database.updateEntry(["Dir1", "Dir2"...], entrydata*seemorebelow*);
// Database.deleteEntry(["Dir1", "Dir2"...], username or id);
// Database.createBranch(["Dir1", "Dir2"...], branchname);
// Database.deleteBranch(["Dir1", "Dir2"...], branchname);
// Database.getAdmins();
// Database.addAdmin(username);
// Database.removeAdmin(username);

// entrydata is an object that can be of either user or file type
// user type: {id: "username", password: "password"}
// file type: {id: "filename", url: "fileurl"}
// there is also an admin type but this only requires an id as it references a user


function hashPassword(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}

function user(username, password) {
    return {
        id: username,
        password: hashPassword(password),
    };
}
function file(filename, url) {
    return {
        id: filename,
        url: url,
    };
}
function urltolist(dirurl){
    const dirList = dirurl.split(/\\|\//);
    return dirList;
}

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

app.post('/api/login', (req, res) => {
    let username = req.body.username.toLowerCase();
    let password = hashPassword(req.body.password);
    try {
        let user = Database.getEntry(['users'], username);
        if (user.password === password) {
            let isadmin = Database.getAdmins().includes(username);
            res.status(200).send({ success: true, admin: isadmin, username: username, password: password });
        } else {
            res.status(401).send({ success: false, error: 'Incorrect password'});
        }
    } catch (err) {
        res.status(400).send({ success: false, error: 'User not found'});
    }
});

// ... rest of the server code
app.listen(5000, () => {
    console.log('Server started on port 5000');
});

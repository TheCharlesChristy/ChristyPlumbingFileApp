const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

app.post('/api/login', (req, res) => {
    console.log(req.body);
    res.status(200).send(JSON.stringify({ message: 'Hello from server!' }));
});

// ... rest of the server code
app.listen(5000, () => {
    console.log('Server started on port 5000');
});

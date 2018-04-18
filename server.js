const express = require('express')
const app = express();

var parser = require('./firebase/parseFiles.js')
app.get('/', parser.file);
app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'));

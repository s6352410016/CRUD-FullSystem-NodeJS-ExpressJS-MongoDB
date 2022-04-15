const express = require('express');
const path = require('path');
const router = require('./routes/routes');
const fileUpload = require('express-fileupload');

const app = express();

app.use(express.static(path.join(__dirname , 'public')));
app.set('views' , path.join(__dirname , 'views'));
app.set('view engine' , 'ejs');

app.use(express.urlencoded({extended:false}));

app.use(fileUpload());
app.use(router);

app.listen(3000 , () => {
    console.log('Start server...');
});
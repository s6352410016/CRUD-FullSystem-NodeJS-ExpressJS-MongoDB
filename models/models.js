const mongoose = require('mongoose');
const dbUrl = 'mongodb://localhost:27017/CRUD_DB';

mongoose.connect(dbUrl , {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => {
    if(err){
        throw err;
    }else{
        console.log('Connected to database success');
    }
});

let schema = mongoose.Schema({
    fullname: String,
    address: String,
    tel: Number,
    image: String, 
});

let model = mongoose.model('Customer' , schema);

module.exports = model;

module.exports.saveData = (model , data) => {
    model.save(data);
}
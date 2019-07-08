var express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

//conecao com o data base
try{
    db = mongoose.connect('mongodb://mongo_api:27017/api',{ useNewUrlParser: true });
} catch(e) {
    console.log('deu erro na conecao com o mongodb');
    console.log(e);
}

//importa as rotas
var router = require('./router');
//importa a qeue sale
var sale_qeue = require('./qeue/PaySaleQeue');

var app = express();
//usa json no body
app.use(express.json());
//usa as rotas
app.use(router);

app.listen(3000,()=>{
    console.log('[*] Server Listing at 3000');
});
//comeca a consumir a qeue
sale_qeue.listenForResults();
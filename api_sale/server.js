var express = require('express');
const dotenv = require('dotenv');
dotenv.config();
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
var qeueSale = require('../qeue/PaySaleQeue');
var calc = require('../utils/calc');
var sale = require('../model/Sale');

module.exports = {
    async index(req,res){
        qeueSale.sendMessage({ola:'mundo'});
        return res.json({
            hello:'world'
        });
    },
    async create(req,res){
        //corpo da requisica
        let data = req.body;
        //calcula o valor total da compra
        let total = calc.total_venda(data.itens);
        //cria a venda no db
        let sale_rs = await sale.create({
            client:data.client,
            value:total,
        })
        //constroi a data da mensagem
        let qeue_msg = {
            total:total,
            client:sale_rs.client,
            id:sale_rs._id
        }
        //envia uma msg para o servico de pagamento
        qeueSale.sendMessage(qeue_msg);
        return res.json(sale_rs);
    }
}
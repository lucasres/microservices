var qeueSale = require('../qeue/PaySaleQeue');
var calc = require('../utils/calc');

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
        //envia uma msg para o servico de pagamento
        qeueSale.sendMessage({'total':total});
        return res.json({
            'total':total
        });
    }
}
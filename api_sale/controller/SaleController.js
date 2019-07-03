var qeueSale = require('../qeue/PaySaleQeue');

module.exports = {
    async index(req,res){
        qeueSale.sendMessage({ola:'mundo'});
        return res.json({
            hello:'world'
        });
    }
}
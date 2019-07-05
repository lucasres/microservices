module.exports = {
    total_venda(itens=[]) {
        return itens.reduce((acc,cur)=>{
            return acc + (cur.ammount * cur.value);
        },0);
    }
}
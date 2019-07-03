var amqp = require('amqplib/callback_api');
var uuid = require('uuid');


module.exports = {
    listenForResults() {
        amqp.connect(process.env.BROKER_URL,(err,conn)=>{
            conn.createChannel((err,ch)=>{
                let q = process.env.QEUE_RESULTS;
                //cria ou recupera a qeue
                ch.assertQueue(q,{durable:true});
                //
                ch.prefetch(1);
                ch.consume(q,(msg)=>{
                    console.log(`[*] Recived Message ${q}`);
                    //a mensagem vem em content 
                    //precisa de dois parse
                    //o primeiro para converter em string pois vem em buffer
                    //depois o de string para json
                    let data = JSON.parse(msg.content.toString());
                    //imprime o status do processamento
                    console.log(`[*] Process:${data.status}`);
                    //envia um ack dizendo que recebeu a mensagem
                    ch.ack(msg);
                });
                console.log(`[*] Start Consume ${q}`);
                
            });
        });
    },
    sendMessage(msg={}) {
        amqp.connect(process.env.BROKER_URL,(err,conn)=>{
            conn.createChannel((err,ch)=>{
                let q = process.env.QEUE_REQUEST;
                let routingKey = process.env.ROUTING_KEY_REQUEST;
                ch.sendToQueue(q,Buffer.from(JSON.stringify(msg)),{
                    correlationId:uuid(),
                    replyTo:process.env.QEUE_RESULTS
                });
                console.log(`[*] Send Message to ${q}`);
                
            });
        });
    },
}
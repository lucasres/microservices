const amqp = require('amqplib/callback_api');

const utils = require('./utils');

amqp.connect('amqp://root:toor@rabbitmq:5672',(err,conn)=>{
    conn.createChannel((err,ch)=>{
        const q = 'processing.request';

        ch.assertQueue(q, { durable: true });
        ch.prefetch(1);

        //loga que esta ok
        console.log(' [*] Awaiting RPC requests');

        ch.consume(q,function reply(msg){
            //print no servidor
            console.log(`Recived message [.] ID ${msg.properties.correlationId}`);
            //faz o parse pois recebe como buffer
            const data = JSON.parse(msg.content.toString());
            //loga que recebeu
            console.log(data);
            //realaiza o pagamento fake
            console.log('Realizando pagamento:');
            console.log(`Cliente..:${data.client}`);
            console.log(`Valor....:${data.total}`);
            console.log(`Id.......:${data.id}`);
            
            const rs_pay = utils.getRndInteger(0,1);
            console.log(rs_pay);
            var rs_data = {}
            if (rs_pay){
                console.log(`Pagamento aprovado [OK]`);
                rs_data.status = true;
            } else {
                console.log(`Pagamento negado [FAIL]`);
                rs_data.status = false;
            }

            
            //devolve a mensagem
            ch.sendToQueue(msg.properties.replyTo,
                Buffer.from(JSON.stringify(rs_data)),
                { correlationId: msg.properties.correlationId }    
            );
            
            ch.ack(msg);
        });
    });
});
const amqp = require('amqplib/callback_api');

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
            console.log(`Cartao.:${data.num_card}`);
            console.log(`Cvv....:${data.cvv}`);
            console.log(`Valor..:${data.value}`);
            console.log(`Pagamento aprovado [OK]`);
            
                        //devolve a mensagem
            ch.sendToQueue(msg.properties.replyTo,
                Buffer.from('{"status":true}'),
                { correlationId: msg.properties.correlationId }    
            );
            
            ch.ack(msg);
        });
    });
});
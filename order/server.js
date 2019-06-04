const amqp = require('amqplib/callback_api');

amqp.connect('amqp://root:toor@rabbitmq:5672',(err,conn)=>{
    conn.createChannel((err,ch)=>{
        const q = 'rpc_qeue';

        ch.assertQueue(q, { durable: false });
        ch.prefetch(1);

        //loga que esta ok
        console.log(' [x] Awaiting RPC requests');1

        ch.consume(q,function reply(msg){
            console.log(JSON.parse(msg.content.toString()));
            //faz o parse pois recebe como buffer
            const id = parseInt(msg.content.toString(), 10);
            //loga que recebeu
            console.log(`Recived message [.] ID ${id}`);
            //devolve a mensagem
            ch.sendToQueue(msg.properties.replyTo,
                new Buffer('name: Lucas, teste: Hello'),
                { correlationId: msg.properties.correlationId }    
            );
            
            ch.ack(msg);
        });
    });
});
const amqp = require('amqplib/callback_api');

amqp.connect('amqp://root:toor@rabbitmq:5672',(err,conn)=>{
    conn.createChannel((err,ch)=>{
        const q = 'rpc_qeue';

        ch.assertQueue(q, { durable: false });
        ch.prefetch(1);

        //loga que esta ok
        console.log(' [x] Awaiting RPC requests');1

        ch.consume(q,function reply(msg){
            //faz o parse pois recebe como buffer
            let data = JSON.parse(msg.content.toString());
            //loga que recebeu
            console.log(data);
            //print no servidor
            console.log(`Recived message [.] ID ${msg.properties.correlationId}`);
            //realaiza o pagamento fake
            setTimeout(()=>{
                console.log('Realizando pagamento:');
                console.log(`Cartao.:${data.num_card}`);
                console.log(`Cvv....:${data.cvv}`);
                console.log(`Valor..:${data.value}`);
                console.log(`Pagamento aprovado [OK]`);
                
            },2500);
            //devolve a mensagem
            ch.sendToQueue(msg.properties.replyTo,
                new Buffer('name: Lucas, teste: Hello'),
                { correlationId: msg.properties.correlationId }    
            );
            
            ch.ack(msg);
        });
    });
});
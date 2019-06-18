import pika
import uuid
import json
import time

class RpcInterface(object):
    host = None
    queue = None

    def __init__(self):
        #cria conexao TCP
        self.connection = pika.BlockingConnection(
            pika.URLParameters(self.host)
        )
        #cria um canal virtual que server para o envio e consumo de mensagens
        self.channel = self.connection.channel()
        #declara a queue criando se for necessario
        result = self.channel.queue_declare(queue='', exclusive=True)
        self.callback_queue = result.method.queue
        #inicia o consumo da queue para o processo do retorno da chamada
        self.channel.basic_consume(
            queue=self.callback_queue,
            on_message_callback=self.on_response,
            auto_ack=True
        )

    def on_response(self, ch, method, props, body):
        #verifica se a mensagem foi para este consumer
        if self.corr_id == props.correlation_id:
            self.response = body

    def call(self, body):
        self.response = None
        #cria um id unico para a requesicao
        self.corr_id = str(uuid.uuid4())
        #envia uma mensagem basica
        self.channel.basic_publish(
            exchange='',
            routing_key=self.queue,
            properties=pika.BasicProperties(
                reply_to=self.callback_queue,
                correlation_id=self.corr_id,
            ),
            body=json.dumps(body)
        )
        #espera pela resposta
        while self.response is None:
            self.connection.process_data_events()
            time.sleep(0.1)
        #imprime que deu certo
        self.handle_response(self.response)
    
    def handle_response(self,data):
        """
        Metodo que lida com o retorno da response
        """
        raise NotImplementedError()
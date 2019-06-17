import json
import pika
import uuid

class SalesRepository():
    """
    Logica do negocio
    """

    @classmethod
    def make_sale(cls,serializer):
        """
        Faz uma venda no sistema
        request: Django request
        serializer: SaleCreateSerializer 
        return:
        """
        #simula a venda
        sale = serializer.data
        sale.update({'value_total':cls.value_sale(sale.pop('itens'))})
        #chama o metodo que faz o pagamento 
        cls.process_payment(sale)
    
    @classmethod
    def process_payment(cls,sale):
        """
        Realiza o pagamento de uma venda
        """
        #data para enviar ao microservico de pagamento
        data = {
            'num_card':sale['num_card'],
            'cvv':sale['cvv'],
            'value':sale['value_total']
        }
        #gera o correlation_id
        correlation_id = str(uuid.uuid4())
        #corpo da RPC
        data = json.dumps(data)        
        #inicia a conexao
        conn = pika.BlockingConnection(
            pika.URLParameters('amqp://root:toor@rabbitmq:5672')
        )
        #instancia o channel
        channel = conn.channel()
        channel.basic_publish(
            exchange='',
            routing_key='rpc_qeue',
            properties=pika.BasicProperties(
                reply_to='',
                correlation_id=correlation_id,
            ),
            body=data
        )


    @classmethod
    def value_sale(cls,itens):
        """
        Calcula o total da venda
        itens: List
        return: Float
        """
        total = 0
        for item in itens:
            total += item['value']*item['ammount']
        return total
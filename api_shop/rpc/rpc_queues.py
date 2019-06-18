from .rpc_interface import RpcInterface
import json

class RcpOrder(RpcInterface):
    host = 'amqp://root:toor@rabbitmq:5672'
    queue = 'rpc_qeue'

    def handle_response(self,data):
        """
        Metodo que processa o retorno recebido
        """
        data = json.loads(data)
        if data['result']:
            print('COMPRA APROVADA')
        else:    
            print('COMPRA NEGADA')
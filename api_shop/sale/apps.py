from django.apps import AppConfig
from rpc.rpc_queues import RcpOrder

class SaleConfig(AppConfig):
    name = 'sale'

    def ready(self):
        r = RcpOrder()
        r.daemon = True
        r.start()